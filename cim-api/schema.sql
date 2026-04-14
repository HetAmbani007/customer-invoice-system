-- 1. USERS TABLE
   
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    phoneNumber VARCHAR(15),
    passwordHash TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

   
-- CUSTOMERS TABLE
   
CREATE TABLE IF NOT EXISTS customers (
    customerId SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT,
    phoneNumber VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);

   
-- INVOICES TABLE
   
CREATE TABLE IF NOT EXISTS invoices (
    invoiceId SERIAL PRIMARY KEY,
    invoiceNumber VARCHAR(20) UNIQUE,
    customerId INT REFERENCES customers(customerId),
    invoiceDate DATE,
    dueDate DATE,
    terms INT,
    totalAmount NUMERIC(10,2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN DEFAULT FALSE
);

   
-- INVOICE LINES TABLE
   
CREATE TABLE IF NOT EXISTS invoiceLines (
    lineId SERIAL PRIMARY KEY,
    invoiceId INT REFERENCES invoices(invoiceId) ON DELETE CASCADE,
    description TEXT,
    quantity INT,
    unitPrice NUMERIC(10,2),
    lineTotal NUMERIC(10,2)
);

   
-- CREATE CUSTOMER
   
CREATE OR REPLACE FUNCTION fn_createCustomer(
    p_name VARCHAR,
    p_address TEXT,
    p_phone VARCHAR,
    p_email VARCHAR
)
RETURNS INT AS $$
DECLARE newId INT;
BEGIN
    INSERT INTO customers(name, address, phoneNumber, email)
    VALUES (p_name, p_address, p_phone, p_email)
    RETURNING customerId INTO newId;

    RETURN newId;
END;
$$ LANGUAGE plpgsql;

   
-- GET CUSTOMERS
   
CREATE OR REPLACE FUNCTION fn_getCustomers(
    p_search TEXT,
    p_sortBy TEXT,
    p_sortDir TEXT,
    p_page INT,
    p_pageSize INT
)
RETURNS TABLE(
    customerId INT,
    name VARCHAR,
    address TEXT,
    phoneNumber VARCHAR,
    email VARCHAR,
    totalCount INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.customerId,
        c.name,
        c.address,
        c.phoneNumber,
        c.email,
        COUNT(*) OVER()::INT AS totalCount
    FROM customers c
    WHERE c.isDeleted = FALSE
    AND (
        p_search IS NULL OR
        c.name ILIKE '%' || p_search || '%' OR
        c.email ILIKE '%' || p_search || '%' OR
        c.phoneNumber ILIKE '%' || p_search || '%'
    )
    ORDER BY c.customerId DESC
    LIMIT p_pageSize OFFSET (p_page - 1) * p_pageSize;
END;
$$ LANGUAGE plpgsql;

   
-- GET CUSTOMER BY ID
   
CREATE OR REPLACE FUNCTION fn_getCustomerById(p_id INT)
RETURNS TABLE(
    customerId INT,
    name VARCHAR,
    address TEXT,
    phoneNumber VARCHAR,
    email VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT customerId, name, address, phoneNumber, email
    FROM customers
    WHERE customerId = p_id AND isDeleted = FALSE;
END;
$$ LANGUAGE plpgsql;

   
-- CUSTOMER DROPDOWN
   
CREATE OR REPLACE FUNCTION fn_getCustomerDropdown()
RETURNS TABLE(
    customerId INT,
    name VARCHAR,
    email VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT customerId, name, email
    FROM customers
    WHERE isDeleted = FALSE
    ORDER BY name;
END;
$$ LANGUAGE plpgsql;

   
-- SOFT DELETE CUSTOMER
   
CREATE OR REPLACE FUNCTION fn_softDeleteCustomer(p_id INT)
RETURNS VOID AS $$
BEGIN
    UPDATE customers
    SET isDeleted = TRUE,
        updatedAt = CURRENT_TIMESTAMP
    WHERE customerId = p_id;
END;
$$ LANGUAGE plpgsql;

   
-- NEXT INVOICE NUMBER
   
CREATE OR REPLACE FUNCTION fn_getNextInvoiceNumber()
RETURNS TEXT AS $$
DECLARE nextNum INT;
BEGIN
    SELECT COUNT(*) + 1 INTO nextNum FROM invoices;
    RETURN 'INV-' || LPAD(nextNum::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

   
-- CREATE INVOICE
   
CREATE OR REPLACE FUNCTION fn_createInvoice(
    p_invoiceNumber VARCHAR,
    p_customerId INT,
    p_invoiceDate DATE,
    p_dueDate DATE,
    p_terms INT,
    p_totalAmount NUMERIC
)
RETURNS INT AS $$
DECLARE newId INT;
BEGIN
    INSERT INTO invoices(invoiceNumber, customerId, invoiceDate, dueDate, terms, totalAmount)
    VALUES (p_invoiceNumber, p_customerId, p_invoiceDate, p_dueDate, p_terms, p_totalAmount)
    RETURNING invoiceId INTO newId;

    RETURN newId;
END;
$$ LANGUAGE plpgsql;

   
-- CREATE INVOICE LINE
   
CREATE OR REPLACE FUNCTION fn_createInvoiceLine(
    p_invoiceId INT,
    p_description TEXT,
    p_quantity INT,
    p_unitPrice NUMERIC,
    p_lineTotal NUMERIC
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO invoiceLines(invoiceId, description, quantity, unitPrice, lineTotal)
    VALUES (p_invoiceId, p_description, p_quantity, p_unitPrice, p_lineTotal);
END;
$$ LANGUAGE plpgsql;

   
-- GET INVOICES LIST
   
CREATE OR REPLACE FUNCTION fn_getInvoices(
    p_page INT,
    p_pageSize INT
)
RETURNS TABLE(
    invoiceId INT,
    customerName VARCHAR,
    invoiceDate DATE,
    dueDate DATE,
    totalAmount NUMERIC,
    totalCount INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.invoiceId,
        c.name,
        i.invoiceDate,
        i.dueDate,
        i.totalAmount,
        COUNT(*) OVER()::INT
    FROM invoices i
    JOIN customers c ON i.customerId = c.customerId
    WHERE i.isDeleted = FALSE
    ORDER BY i.invoiceId DESC
    LIMIT p_pageSize OFFSET (p_page - 1) * p_pageSize;
END;
$$ LANGUAGE plpgsql;

   
-- GET INVOICE DETAILS (EDIT)
   
CREATE OR REPLACE FUNCTION fn_getInvoiceDetails(p_invoiceid INT)
RETURNS TABLE (
  invoiceid INT,
  customerid INT,
  invoicedate DATE,
  duedate DATE,
  terms INT,
  totalamount NUMERIC,
  description TEXT,
  quantity INT,
  unitprice NUMERIC,
  linetotal NUMERIC
)
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.invoiceid,
    i.customerid,
    i.invoicedate,
    i.duedate,
    i.terms,
    i.totalamount,
    il.description,
    il.quantity,
    il.unitprice,
    il.linetotal
  FROM invoices i
  LEFT JOIN invoiceLines il
    ON i.invoiceid = il.invoiceid
  WHERE i.invoiceid = p_invoiceid
  AND i.isDeleted = FALSE;
END;
$$ LANGUAGE plpgsql;

   
-- UPDATE INVOICE
CREATE OR REPLACE FUNCTION fn_updateInvoice(
    p_invoiceId INT,
    p_customerId INT,
    p_invoiceDate DATE,
    p_dueDate DATE,
    p_terms INT,
    p_totalAmount NUMERIC
)
RETURNS VOID AS $$
BEGIN
    UPDATE invoices
    SET 
        customerId = p_customerId,
        invoiceDate = p_invoiceDate,
        dueDate = p_dueDate,
        terms = p_terms,
        totalAmount = p_totalAmount,
        updatedAt = CURRENT_TIMESTAMP
    WHERE invoiceId = p_invoiceId;
END;
$$ LANGUAGE plpgsql;

   
--  DELETE INVOICE LINES
CREATE OR REPLACE FUNCTION fn_deleteInvoiceLines(p_invoiceId INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM invoiceLines WHERE invoiceId = p_invoiceId;
END;
$$ LANGUAGE plpgsql;

   
--  SOFT DELETE INVOICE 
CREATE OR REPLACE FUNCTION fn_softDeleteInvoice(p_invoiceId INT)
RETURNS VOID AS $$
BEGIN
    UPDATE invoices
    SET isDeleted = TRUE,
        updatedAt = CURRENT_TIMESTAMP
    WHERE invoiceId = p_invoiceId;
END;
$$ LANGUAGE plpgsql;