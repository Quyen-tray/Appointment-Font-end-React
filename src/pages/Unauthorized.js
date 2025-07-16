import React from 'react';

export default function Unauthorized() {
    return (
        <div className="container mt-5">
            <h3>🚫 Không có quyền truy cập</h3>
            <p>Chức năng này chỉ dành cho người dùng có quyền </p>
        </div>
    );
}