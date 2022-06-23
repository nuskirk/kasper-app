import { Form, Input, Modal } from 'antd';

interface IEditModal {
  showEditModal: boolean;
  handleCloseEditModal: () => void;
  submitEditPerson: (event: { preventDefault: () => void; }) => Promise<void>;
  editingName: string;
  onChangeEditPersonName: (event: { target: { value: string; }; }) => void;
}

const EditModal = ({
  showEditModal,
  handleCloseEditModal,
  submitEditPerson,
  editingName,
  onChangeEditPersonName
}: IEditModal): JSX.Element => (
  <Modal title="Edit Person" visible={showEditModal} onOk={submitEditPerson} onCancel={handleCloseEditModal}>
    <Form>
      <Form.Item
        label="name"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input onChange={onChangeEditPersonName} value={editingName} />
      </Form.Item>
    </Form>
  </Modal>
)

export default EditModal;
