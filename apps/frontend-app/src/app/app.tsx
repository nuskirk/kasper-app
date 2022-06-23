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
          pre_position: preDeletedPerson ? preDeletedPerson.id : null
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
      const newPerson = await PersonAPI.add({ name: values.name, pre_position: null });
      setPersons([newPerson]);
      return;
    }

    const lastPerson = persons[persons.length - 1];
    const newPerson = await PersonAPI.add({ name: values.name, pre_position: lastPerson.id });

    setPersons([...persons, newPerson]);
  }

  const reorder = (list: Iterable<IPerson> | ArrayLike<IPerson>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = async (result: DropResult): Promise<void> => {
    if (!result.destination) {
      return;
    }

    const destinationIndex = result.destination.index;
    const sourceIndex = result.source.index;

    if (destinationIndex === sourceIndex) {
      return;
    }

    const orderedPersons = reorder(
      persons,
      sourceIndex,
      destinationIndex
    );

    const promises = [];
    const changedPerson = orderedPersons[destinationIndex];

    if (destinationIndex === 0) {
      const nextPerson = orderedPersons[destinationIndex + 1];

      changedPerson.pre_position = null;

      promises.push(
        PersonAPI.update(changedPerson.id, {
          pre_position: changedPerson.pre_position
        }),
        PersonAPI.update(nextPerson.id, {
          pre_position: changedPerson.id
        })
      )

      const sourceNext = persons[sourceIndex + 1];

      if (sourceNext) {
        const sourcePre = persons[sourceIndex - 1];

        promises.push(
          PersonAPI.update(sourceNext.id, {
            pre_position: sourcePre.id
          })
        )
      }

    } else if (destinationIndex === orderedPersons.length - 1) {
      const prePerson = orderedPersons[destinationIndex - 1];

      changedPerson.pre_position = prePerson.id;

      promises.push(
        PersonAPI.update(changedPerson.id, {
          pre_position: changedPerson.pre_position
        }),
      )

      const sourcePre = persons[sourceIndex - 1];
      const sourceNext = persons[sourceIndex + 1];

      if (sourcePre) {
        promises.push(
          PersonAPI.update(sourceNext.id, {
            pre_position: sourcePre.id
          })
        )
      } else {
        promises.push(
          PersonAPI.update(sourceNext.id, {
            pre_position: null
          })
        )
      }
    } else {
      const prePerson = orderedPersons[destinationIndex - 1];
      const nextPerson = orderedPersons[destinationIndex + 1];

      changedPerson.pre_position = prePerson.id;

      promises.push(
        PersonAPI.update(changedPerson.id, {
          pre_position: changedPerson.pre_position
        }),
        PersonAPI.update(nextPerson.id, {
          pre_position: changedPerson.id
        })
      )

      const sourcePre = persons[sourceIndex - 1];
      const sourceNext = persons[sourceIndex + 1];

      if (!sourcePre) {
        promises.push(
          PersonAPI.update(sourceNext.id, {
            pre_position: null
          })
        )
      }

      if (sourcePre && sourceNext) {
        promises.push(
          PersonAPI.update(sourceNext.id, {
            pre_position: sourcePre.id
          })
        )
      }
    }

    orderedPersons.splice(destinationIndex, 1, { ...changedPerson });

    await Promise.all(promises);

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
