import { Card, Button, Form, Input, Row, Col } from 'antd';

interface IAddPersonSection {
  addNewPerson: (values: { name: string }) => Promise<void>;
}

const AddPersonSection = ({ addNewPerson }: IAddPersonSection): JSX.Element => {
  return (
    <Card title="Add New Person">
      <Form onFinish={addNewPerson} initialValues={{ name: '' }}>
        <Row>
          <Col span={22}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={2}>
            <Form.Item >
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default AddPersonSection;
