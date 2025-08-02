import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, InputGroup, DropdownButton, Dropdown } from "react-bootstrap";
import { FaEdit, FaInfoCircle, FaSearch, FaHotel } from "react-icons/fa";

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState("");
    const [editingRoom, setEditingRoom] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [roomTypeFilter, setRoomTypeFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const roomsPerPage = 5;
    const token = localStorage.getItem("token");
    const [roomTypes, setRoomTypes] = useState([]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8081/api/rooms/all", {
                headers: { Authorization: `Bearer ${token}` }

            });
            setRooms(response.data);
            const types = [...new Set(response.data.map(room => room.roomType))];
            setRoomTypes(types);
        } catch (err) {
            console.error("Error fetching rooms:", err);
            setError("Không thể tải danh sách phòng.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (room) => {
        setEditingRoom({ ...room });
        setShowEditModal(true);
    };

    const handleDetailClick = (room) => {
        setSelectedRoom(room);
        setShowDetailModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingRoom((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn lưu thay đổi không?")) return;

        try {
            setLoading(true);
            await axios.put(`http://localhost:8081/api/rooms/${editingRoom.id}`, {
                roomNumber: editingRoom.roomNumber,
                roomName: editingRoom.roomName,
                roomType: editingRoom.roomType,
                floor: editingRoom.floor,
                status: editingRoom.status,
                description: editingRoom.description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowEditModal(false);
            fetchRooms();
            alert("Cập nhật thành công!");
        } catch (err) {
            console.error("Error updating room:", err);
            alert("Lỗi khi cập nhật thông tin phòng.");
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const filteredRooms = rooms.filter((room) =>
        room.roomName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (roomTypeFilter === "" || room.roomType === roomTypeFilter)
    );
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
    const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container py-4">
            <h2 className="text-center text-primary mb-4"><FaHotel className="me-2" /> Danh Sách Phòng</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Search and Filter */}
            <div className="d-flex justify-content-between mb-4">
                <InputGroup className="w-50">
                    <Form.Control
                        placeholder="Tìm kiếm phòng theo tên"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-secondary" onClick={() => fetchRooms()}>
                        <FaSearch /> Tìm kiếm
                    </Button>
                </InputGroup>

                <DropdownButton
                    id="dropdown-room-type"
                    title={roomTypeFilter || "Loại phòng"}
                    onSelect={(e) => setRoomTypeFilter(e)}
                    variant="outline-primary"
                >
                    <Dropdown.Item eventKey="">Tất cả</Dropdown.Item>
                    {roomTypes.map((type, index) => (
                        <Dropdown.Item key={index} eventKey={type}>
                            {type}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>

            {/* Room List */}
            <div className="row">
                {loading ? (
                    <div className="text-center w-100">
                        <Button variant="secondary" disabled>
                            Đang tải dữ liệu...
                        </Button>
                    </div>
                ) : (
                    currentRooms.map((room, index) => (
                        <div className="col-lg-4 col-md-6 mb-4" key={room.id}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Tên Phòng: {room.roomName}</h5>
                                    <p className="card-text">Mã phòng: {room.roomNumber}</p>
                                    <p className="card-text">Loại: {room.roomType}</p>
                                    <p className="card-text">Tầng: {room.floor}</p>
                                    <p className="card-text">Mô tả: {room.description}</p>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleEditClick(room)}
                                        className="w-100 mb-2"
                                    >
                                        <FaEdit /> Sửa
                                    </Button>
                                    <Button
                                        variant="info"
                                        onClick={() => handleDetailClick(room)} // Open detail modal
                                        className="w-100"
                                    >
                                        <FaInfoCircle /> Chi tiết
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`mx-1 ${currentPage === i + 1 ? 'btn-primary' : 'btn-light'}`}
                    >
                        {i + 1}
                    </Button>
                ))}
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa thông tin phòng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formRoomNumber">
                            <Form.Label>Mã Phòng</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Mã phòng"
                                name="roomNumber"
                                value={editingRoom?.roomNumber}
                                onChange={handleEditChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formRoomName">
                            <Form.Label>Tên Phòng</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tên phòng"
                                name="roomName"
                                value={editingRoom?.roomName}
                                onChange={handleEditChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formRoomType">
                            <Form.Label>Loại Phòng</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Loại phòng"
                                name="roomType"
                                value={editingRoom?.roomType}
                                onChange={handleEditChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formFloor">
                            <Form.Label>Tầng</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Tầng"
                                name="floor"
                                value={editingRoom?.floor}
                                onChange={handleEditChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formStatus">
                            <Form.Label>Trạng Thái</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Trạng thái"
                                name="status"
                                value={editingRoom?.status}
                                onChange={handleEditChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Mô Tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Mô tả phòng"
                                name="description"
                                value={editingRoom?.description}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Room Detail Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết phòng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRoom && (
                        <div>
                            <p><strong>Mã phòng:</strong> {selectedRoom.roomNumber}</p>
                            <p><strong>Tên phòng:</strong> {selectedRoom.roomName}</p>
                            <p><strong>Loại phòng:</strong> {selectedRoom.roomType}</p>
                            <p><strong>Tầng:</strong> {selectedRoom.floor}</p>
                            <p><strong>Trạng thái:</strong> {selectedRoom.status}</p>
                            <p><strong>Mô tả:</strong> {selectedRoom.description}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default RoomList;
