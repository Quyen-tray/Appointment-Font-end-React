import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { Modal, Button, Card, Dropdown, ButtonGroup, Badge } from "react-bootstrap";
import { FaGenderless, FaSearch, FaHistory } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { Form } from "react-bootstrap";


function PatientList() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPatient, setEditPatient] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    username: "",
    password: "",
  });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoPatient, setInfoPatient] = useState(null);

  const handleEditClick = (patient) => {
    setEditPatient(patient);
    setShowEditModal(true);
  };
  const handleInfoClick = (patient) => {
    setInfoPatient(patient);
    setShowInfoModal(true);
  };

  const handleInputChange = (e) => {
    setEditPatient({
      ...editPatient,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePatient = async () => {
    try {
      await axios.put(`http://localhost:8081/api/patients/${editPatient.id}`, editPatient, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowEditModal(false);
      fetchPatients(); // Refresh danh sách
      alert("✅ Cập nhật thông tin bệnh nhân thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật bệnh nhân", error);
      alert("❌ Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleCreatePatient = async () => {
    const { fullName, dob, gender, phone, email, address, username, password } = newPatient;

    if (!fullName || !dob || !gender || !phone || !email || !address || !username || !password) {
      alert("❌ Vui lòng điền đầy đủ tất cả các thông tin!");
      return;
    }
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      alert("❌ Số điện thoại phải có 10 đến 11 chữ số!");
      return;
    }
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
      alert("❌ Bệnh nhân phải đủ 18 tuổi trở lên!");
      return;
    }
    if (password.length < 8) {
      alert("❌ Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    try {
      await axios.post("http://localhost:8081/api/patients", newPatient, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowCreateModal(false);
      fetchPatients();
      alert("✅ Tạo bệnh nhân mới thành công!");
      setNewPatient({
        fullName: "",
        dob: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        username: "",
        password: "",
      });
    } catch (error) {
      console.error("Lỗi khi tạo bệnh nhân mới", error);
      alert("❌ Tạo bệnh nhân thất bại!");
    }
  };



  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { token } = useAuth();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bệnh nhân", error);
    }
  };

  const fetchHistory = async (patient) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/${patient.id}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPatient(patient);
      setHistory(res.data);
      setShowModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử khám", error);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const fullName = p.fullName?.toLowerCase() || "";
    const email = p.email?.toLowerCase() || "";
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    const matchesGender =
        genderFilter === "all" || (p.gender && p.gender.toLowerCase() === genderFilter.toLowerCase());
    return matchesSearch && matchesGender;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, genderFilter]);

  const genderDisplay = {
    all: "Tất cả",
    Nam: "🧍‍♂️ Nam",
    Nữ: "👩‍🦰 Nữ",
    Khác: "🧑 Khác",
  };

  return (
      <div className="container mt-4">
        <h2 className="mb-4 text-primary">🧑‍⚕️ Quản lý Bệnh nhân</h2>

        {/* Bộ lọc */}
        <div className="row mb-4 align-items-end">
          <div className="col-md-3">
            <label className="form-label fw-bold">Giới tính:</label>
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle variant="outline-primary" id="dropdown-gender">
                <FaGenderless className="me-2" />
                {genderDisplay[genderFilter]}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setGenderFilter("all")}>-- Tất cả --</Dropdown.Item>
                <Dropdown.Item onClick={() => setGenderFilter("Nam")}>🧍‍♂️ Nam</Dropdown.Item>
                <Dropdown.Item onClick={() => setGenderFilter("Nữ")}>👩‍🦰 Nữ</Dropdown.Item>
                <Dropdown.Item onClick={() => setGenderFilter("Khác")}>🧑 Khác</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Tìm kiếm:</label>
            <div className="input-group">
              <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Nhập tên hoặc email bệnh nhân..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 text-end">
            <label className="form-label fw-bold invisible">Thêm bệnh nhân</label>
            <Button
                variant="outline-success"
                className="w-100 fw-bold shadow rounded-pill py-2"
                onClick={() => setShowCreateModal(true)}
            >
              ➕ Thêm bệnh nhân mới
            </Button>
          </div>
        </div>

        {/* Bảng danh sách */}
        <table className="table table-hover shadow-sm rounded">
          <thead className="table-primary">
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Địa chỉ</th>
            <th>Hành Động</th>
            <th>Lịch sử</th>
          </tr>
          </thead>
          <tbody>
          {currentPatients.map((p) => (
              <tr key={p.id}>
                <td className="fw-semibold">{p.fullName}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td>{p.dob}</td>
                <td>
                  <Badge bg={
                    p.gender === "Nam" ? "info" :
                        p.gender === "Nữ" ? "danger" :
                            "secondary"
                  }>
                    {p.gender}
                  </Badge>
                </td>
                <td>{p.address}</td>
                <td>
                  <button className="btn btn-info btn-sm text-white fw-semibold" onClick={() => handleInfoClick(p)}>
                    ℹ️ Thông tin
                  </button>
                  <button className="btn btn-warning btn-sm text-dark fw-semibold" onClick={() => handleEditClick(p)}>
                    ✏️ Sửa
                  </button>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm text-white fw-semibold" onClick={() => fetchHistory(p)}>
                    🩺 Lịch sử
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        {/* Phân trang */}
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>&laquo;</button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>&raquo;</button>
            </li>
          </ul>
        </nav>

        {/* Modal chỉnh sửa bệnh nhân */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>✏️ Chỉnh sửa thông tin bệnh nhân</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                    type="text"
                    name="fullName"
                    value={editPatient.fullName}
                    onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                    type="date"
                    name="dob"
                    value={editPatient.dob}
                    onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select
                    name="gender"
                    value={editPatient.gender}
                    onChange={handleInputChange}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                    type="text"
                    name="phone"
                    value={editPatient.phone}
                    onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={editPatient.email}
                    onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                    type="text"
                    name="address"
                    value={editPatient.address}
                    onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleUpdatePatient}>
              Cập nhật
            </Button>
          </Modal.Footer>
        </Modal>


        {/* Modal Lịch sử */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>🩺 Lịch sử khám bệnh của {selectedPatient?.fullName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {history.length === 0 ? (
                <p className="text-muted">Không có dữ liệu lịch sử khám.</p>
            ) : (
                <div className="timeline">
                  {history.map((item, index) => (
                      <Card key={index} className="mb-3 border-0 shadow-sm">
                        <Card.Body>
                          <Card.Subtitle className="mb-2 text-muted">🗓️ {item.createdAt}</Card.Subtitle>
                          <Card.Text><strong>Trạng thái:</strong> {item.status}</Card.Text>
                          <Card.Text><strong>Chẩn đoán:</strong> {item.diagnosis}</Card.Text>
                          <Card.Text><strong>Ghi chú:</strong> {item.notes}</Card.Text>
                        </Card.Body>
                      </Card>
                  ))}
                </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>ℹ️ Thông tin bệnh nhân</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {infoPatient ? (
                <>
                  <p><strong>Họ tên:</strong> {infoPatient.fullName}</p>
                  <p><strong>Email:</strong> {infoPatient.email}</p>
                  <p><strong>SĐT:</strong> {infoPatient.phone}</p>
                  <p><strong>Ngày sinh:</strong> {infoPatient.dob}</p>
                  <p><strong>Giới tính:</strong> {infoPatient.gender}</p>
                  <p><strong>Địa chỉ:</strong> {infoPatient.address}</p>
                </>
            ) : (
                <p className="text-muted">Không có dữ liệu</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInfoModal(false)}>Đóng</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>➕ Thêm bệnh nhân mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                    type="text"
                    name="fullName"
                    value={newPatient.fullName}
                    onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>SĐT</Form.Label>
                <Form.Control
                    type="text"
                    name="phone"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                    type="date"
                    name="dob"
                    value={newPatient.dob}
                    onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select
                    name="gender"
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                    type="text"
                    name="address"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    value={newPatient.username}
                    onChange={(e) => setNewPatient({ ...newPatient, username: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={newPatient.password}
                    onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Hủy</Button>
            <Button variant="success" onClick={handleCreatePatient}>Tạo mới</Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
}

export default PatientList;
