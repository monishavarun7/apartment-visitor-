
CREATE DATABASE IF NOT EXISTS apartment_visitor_db;

USE apartment_visitor_db;

CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,

    visitor_name VARCHAR(100) NOT NULL,

    phone VARCHAR(15) NOT NULL,

    flat_no VARCHAR(20) NOT NULL,

    purpose VARCHAR(255) NOT NULL,

    check_in DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    check_out DATETIME DEFAULT NULL,

    status ENUM('Inside', 'Checked Out')
        NOT NULL DEFAULT 'Inside',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
