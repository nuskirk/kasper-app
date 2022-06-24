import { useEffect, useState } from 'react';
import PersonAPI from '../api/PersonApi';
import { Col, Row, Layout, Space } from 'antd';
import { DropResult } from "react-beautiful-dnd";
import { IPerson } from '../interfaces';
import Ranking from '../components/Ranking';
import AddPersonSection from '../components/AddPersonSection';
import EditModal from '../components/EditModal';

import 'antd/dist/antd.css';

function App() {
  const [persons, setPersons] = useState<IPerson[]>([]);
  const [editingPerson, setEditingPerson] = useState<IPerson | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const handleCloseEditModal = (): void => setShowEditModal(false);
  const handleShowEditModal = (person: IPerson): void => {
    setEditingPerson(person);
    setEditingName(person.name);
    setShowEditModal(true);
  };

  useEffect((): void => {
    PersonAPI.getAll().then((persons: IPerson[]) => {
      setPersons(persons);
    });
  }, []);

  const submitEditPerson = async (event: { preventDefault: () => void; }): Promise<void>  => {
    event.preventDefault();

    if (editingPerson) {
      const editedPerson = await PersonAPI.update(editingPerson.id, { name: editingName });
      const updatePersons = persons.map((person: IPerson) => {
        return person.id === editedPerson.id ? editedPerson : person;
      });

      setPersons(updatePersons);
      setShowEditModal(false);
    }
  }

  const deletePerson = async (personId: number): Promise<void> => {
    const isDeleted = await PersonAPI.delete(personId);

    if (isDeleted) {
      const updatePersons = persons.filter((person: IPerson): boolean => {
        return person.id !== personId;
      });


      const deletedPersonIndex = persons.findIndex((person: IPerson): boolean => person.id === personId);
      const nextDeletedPerson = persons[deletedPersonIndex + 1];
      const preDeletedPerson = persons[deletedPersonIndex - 1]

      if (nextDeletedPerson) {
        await PersonAPI.update(nextDeletedPerson.id, {
          previous_person_id: preDeletedPerson ? preDeletedPerson.id : null
        })
      }

      setPersons(updatePersons);
    }
  }

  const onChangeEditPersonName = (event: { target: { value: string; }; }): void => {
    setEditingName(event.target.value);
  }

  const addNewPerson = async (values: { name: string }): Promise<void> => {
    if (!persons.length) {
      const newPerson = await PersonAPI.add({ name: values.name, previous_person_id: null });
      setPersons([newPerson]);
      return;
    }

    const lastPerson = persons[persons.length - 1];
    const newPerson = await PersonAPI.add({ name: values.name, previous_person_id: lastPerson.id });

    setPersons([...persons, newPerson]);
  }

  const reorder = (list: Iterable<IPerson> | ArrayLike<IPerson>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = async (result: DropResult): Promise<void> => {
    if (!result.destination) return;

    const destinationIndex = result.destination.index;
    const sourceIndex = result.source.index;

    if (destinationIndex === sourceIndex) return;

    const orderedPersons = reorder(
      persons,
      sourceIndex,
      destinationIndex
    );

    const changedPerson = orderedPersons[destinationIndex];
    const preDestinationPerson = orderedPersons[destinationIndex - 1];
    const nextDestinationPerson = orderedPersons[destinationIndex + 1];
    const sourcePrePerson = persons[sourceIndex - 1];
    const sourceNextPerson = persons[sourceIndex + 1];

    if (!preDestinationPerson) { // Target is moved to first
      changedPerson.previous_person_id = null;
      nextDestinationPerson.previous_person_id = changedPerson.id;
      if (sourceNextPerson) sourceNextPerson.previous_person_id = sourcePrePerson.id;
    } else if (!nextDestinationPerson) { // Target is moved to last
      changedPerson.previous_person_id = preDestinationPerson.id;
      sourceNextPerson.previous_person_id = sourcePrePerson ? sourcePrePerson.id : null;
    } else { // Target is moved inside list
      changedPerson.previous_person_id = preDestinationPerson.id;
      nextDestinationPerson.previous_person_id = changedPerson.id;
      if (!sourcePrePerson) sourceNextPerson.previous_person_id = null;
      if (sourcePrePerson && sourceNextPerson) sourceNextPerson.previous_person_id = sourcePrePerson.id;
    }

    orderedPersons.splice(destinationIndex, 1, { ...changedPerson });

    await Promise.all([
      PersonAPI.update(changedPerson.id, {
        previous_person_id: changedPerson.previous_person_id
      }),
      nextDestinationPerson && PersonAPI.update(nextDestinationPerson.id, {
        previous_person_id: nextDestinationPerson.previous_person_id
      }),
      sourceNextPerson &&  PersonAPI.update(sourceNextPerson.id, {
        previous_person_id: sourceNextPerson.previous_person_id
      })
    ])

    setPersons(orderedPersons);
  }

  return (
    <div className="App">
      <Layout>
        <Layout.Content>
          <Row>
            <Col span={24}>
              <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Row>
                  <Col span={24}>
                    <AddPersonSection
                      addNewPerson={addNewPerson}
                    />
                  </Col>
                </Row>

                <Ranking
                  onDragEnd={onDragEnd}
                  persons={persons}
                  deletePerson={deletePerson}
                  handleShowEditModal={handleShowEditModal}
                />
              </Space>

            </Col>
          </Row>
          <EditModal
            editingName={editingName}
            handleCloseEditModal={handleCloseEditModal}
            onChangeEditPersonName={onChangeEditPersonName}
            showEditModal={showEditModal}
            submitEditPerson={submitEditPerson}
          />
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default App;
