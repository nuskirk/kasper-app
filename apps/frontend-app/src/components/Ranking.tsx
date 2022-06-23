import { Col,
  Row,
  Card,
  Button
} from 'antd';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
  ResponderProvided
} from 'react-beautiful-dnd';
import { IPerson } from '../interfaces';

interface IRankingProps {
  handleShowEditModal: (person: IPerson) => void,
  persons: IPerson[],
  deletePerson: (personId: number) => void
  onDragEnd: (result: DropResult, provided: ResponderProvided) => void,
}

const Ranking = ({
    persons,
    onDragEnd,
    handleShowEditModal,
    deletePerson
  }: IRankingProps): JSX.Element => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {persons.map((person, index) => (
              <Draggable key={person.id} draggableId={person.id.toString()} index={index}>
                {(provided: DraggableProvided) => (
                  <Row
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    key={person.id}>
                    <Col span={24}>
                      <Card>
                        <Row>
                          <Col span={4}>{index + 1}</Col>
                          <Col span={16}>{person.name}</Col>
                          <Col span={4}>
                          <Button onClick={() => handleShowEditModal(person)}>
                              Edit
                            </Button>
                            <Button onClick={() => deletePerson(person.id)}>X</Button>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )


export default Ranking;
