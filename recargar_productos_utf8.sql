-- Recarga corregida de productos Mulford Store en UTF-8
USE MulfordStoreDB;
GO

DELETE FROM Productos;
GO

SET IDENTITY_INSERT Productos ON;
GO

INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (1, N'Base Queen Face Tint', N'Bases', N'BQF2053', N'03', 4, 25000, N'assets/images/products/base-queen-face-tint-tono3.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (2, N'Base Queen Face Tint', N'Bases', N'BQF2053', N'02', 3, 25000, N'assets/images/products/base-queen-face-tint-tono2.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (3, N'Base Aura', N'Bases', N'BAT2272', N'04', 5, 30000, N'assets/images/products/base-aura-04.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (4, N'Base Mousse', N'Bases', N'BMT1675', N'02', 3, 25000, N'assets/images/products/base-mousse-02.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (5, N'Base Mousse', N'Bases', N'BMT1675', N'03', 3, 25000, N'assets/images/products/base-mousse-03.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (6, N'Corrector Doble Super Cool', N'Correctores', N'SP98', N'02', 2, 15000, N'assets/images/products/corrector-doble-super-cool-02.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (7, N'Corrector Doble Super Cool', N'Correctores', N'SP98', N'03', 3, 15000, N'assets/images/products/corrector-doble-super-cool-03.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (8, N'Corrector Doble Super Cool', N'Correctores', N'SP98', N'04', 4, 15000, N'assets/images/products/corrector-doble-super-cool-04.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (9, N'Corrector y Tratamiento Super Concealer', N'Correctores', N'SC8', N'03', 4, 20000, N'assets/images/products/corrector-y-tratamiento-super-concealer-03.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (10, N'Polvos Sueltos Master Touch', N'Polvos', N'PMT1741', N'01', 3, 25000, N'assets/images/products/polvos-sueltos-master-touch-01.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (11, N'Polvos Sueltos Master Touch', N'Polvos', N'PMT1741', N'02', 3, 25000, N'assets/images/products/polvos-sueltos-master-touch-02.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (12, N'Polvo de Hadas Trendy 15g', N'Polvos', N'PH03', N'ESTÁNDAR', 3, 12000, N'assets/images/products/polvo-de-hadas-trendy-15g.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (13, N'Iluminador Wonderland Glow', N'Iluminadores', N'WGT1652', N'ESTÁNDAR', 3, 20000, N'assets/images/products/iluminador-wonderland-glow.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (14, N'Kit x 4 Iluminador Dreams', N'Iluminadores', N'ID02', N'ESTÁNDAR', 3, 15000, N'assets/images/products/kit-x4-iluminador-dreams.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (15, N'Iluminador Líquido Brilla', N'Iluminadores', N'SLB1927', N'ESTÁNDAR', 3, 8000, N'assets/images/products/iluminador-liquido-brilla.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (16, N'Contorno en Barra Individual Bronzer Stick', N'Contornos', N'BST1412', N'ESTÁNDAR', 3, 15000, N'assets/images/products/contorno-en-barra-individual-bronzer-stick.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (17, N'Contorno en Crema Bronzer Stamp', N'Contornos', N'BET1496', N'01', 3, 20000, N'assets/images/products/contorno-en-crema-bronzer-stamp-01.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (18, N'Rubor Dúo Barbie Core', N'Rubores', N'MTT2220', N'ESTÁNDAR', 3, 15000, N'assets/images/products/rubor-duo-barbie-core-01.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (19, N'Rubor Doble Loop Blush', N'Rubores', N'BLT1686', N'ESTÁNDAR', 3, 15000, N'assets/images/products/rubor-doble-loop-blush-02.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (20, N'Rubor en Crema Aura', N'Rubores', N'ABT1742', N'01', 3, 15000, N'assets/images/products/rubor-en-crema-aura-01.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (21, N'Rubor en Crema Aura', N'Rubores', N'ABT1742', N'02', 3, 15000, N'assets/images/products/rubor-en-crema-aura-02.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (22, N'Rubor en Crema Star', N'Rubores', N'RCS2205', N'02', 3, 15000, N'assets/images/products/rubor-en-crema-star-02.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (23, N'Rubor en Crema Star', N'Rubores', N'RCS2205', N'03', 3, 15000, N'assets/images/products/rubor-en-crema-star-03.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (24, N'Rubor en Crema Star', N'Rubores', N'RCS2205', N'04', 3, 15000, N'assets/images/products/rubor-en-crema-star-04.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (25, N'Rubor en Barra Mila', N'Rubores', N'R1598', N'ESTÁNDAR', 3, 10000, N'assets/images/products/rubor-en-barra-mila.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (26, N'Brillo de Labios Lip Oil Pretty', N'Labios', N'LOP2186', N'02', 3, 15000, N'assets/images/products/brillo-de-labios-lip-oil-pretty-02.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (27, N'Brillo de Labios Lip Oil Pretty', N'Labios', N'LOP2186', N'03', 3, 15000, N'assets/images/products/brillo-de-labios-lip-oil-pretty-03.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (28, N'Delineador en Plumón Doble', N'Ojos', N'CAM02', N'ESTÁNDAR', 3, 15000, N'assets/images/products/delineador-en-plumon-doble.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (29, N'Lápiz Delineador Ojos Safari', N'Ojos', N'DST2259', N'CAFÉ OSCURO', 3, 5000, N'assets/images/products/lapiz-delineador-ojos-safari-cafe-oscuro.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (30, N'Lápiz Delineador Ojos Safari', N'Ojos', N'DST2259', N'NEGRO', 3, 5000, N'assets/images/products/lapiz-delineador-ojos-safari-negro.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (31, N'Sombra Frutas Peach', N'Ojos', N'C06-09PEACH', N'ESTÁNDAR', 3, 15000, N'assets/images/products/sombra-frutas-peach.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (32, N'Brillo Lip Oil Sandía', N'Labios', N'BLS2258', N'02', 3, 15000, N'assets/images/products/brillo-lip-oil-sandia-02.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (33, N'Brillo Lip Oil Sandía', N'Labios', N'BLS2258', N'03', 3, 15000, N'assets/images/products/brillo-lip-oil-sandia-03.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (34, N'Brillo Lip Oil Sandía', N'Labios', N'BLS2258', N'04', 3, 15000, N'assets/images/products/brillo-lip-oil-sandia-04.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (35, N'Brillo Lip Oil Sandía', N'Labios', N'BLS2258', N'06', 3, 15000, N'assets/images/products/brillo-lip-oil-sandia-06.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (36, N'Tinta con Escarcha Be Mine', N'Labios', N'TEB1745', N'ESTÁNDAR', 3, 10000, N'assets/images/products/tinta-con-escarcha-be-mine.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (37, N'Tinta y Brillo Doggie Lips Trendy', N'Labios', N'DL07', N'ESTÁNDAR', 3, 10000, N'assets/images/products/tinta-y-brillo-doggie-lips-trendy.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (38, N'Brillo Gloss Mágico Groovy', N'Labios', N'BLT2219', N'ESTÁNDAR', 3, 10000, N'assets/images/products/brillo-gloss-magico-groovy.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (39, N'Brillo de Labios Hologram', N'Labios', N'BHG1893', N'ESTÁNDAR', 3, 15000, N'assets/images/products/brillo-de-labios-hologram.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (40, N'Dúo Exfoliante + Mascarilla de Labios Pink Lemon', N'Labios', N'EML1727', N'ESTÁNDAR', 3, 10000, N'assets/images/products/duo-exfoliante-mascarilla-labios-pink-lemon.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (41, N'Fijador Dreams', N'Fijadores', N'FDT2173', N'ESTÁNDAR', 3, 15000, N'assets/images/products/fijador-dreams.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (42, N'Mascarilla Arcilla Nebula', N'Mascarillas', N'MNT2389', N'ESTÁNDAR', 3, 15000, N'assets/images/products/mascarilla-arcilla-nebula.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (43, N'Mascarilla Romántica', N'Mascarillas', N'MRT2388', N'ESTÁNDAR', 3, 15000, N'assets/images/products/mascarilla-romantica.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (44, N'Esponja Dúo Barbie', N'Accesorios', N'MTT2412', N'ESTÁNDAR', 3, 15000, N'assets/images/products/esponja-duo-barbie.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (45, N'Esponja Panda', N'Accesorios', N'EPT2411', N'ESTÁNDAR', 5, 15000, N'assets/images/products/esponja-panda.png');
INSERT INTO Productos (Id, Nombre, Categoria, Referencia, Tono, Stock, Precio, Imagen) VALUES (46, N'Torre Cat Face', N'Rubores', N'KCF1673', N'ESTÁNDAR', 3, 15000, N'assets/images/products/torre-cat-face.png');

SET IDENTITY_INSERT Productos OFF;
GO

SELECT COUNT(*) AS TotalProductos FROM Productos;
GO