import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { productRouter } from './routes/product.js';
import { entryRouter } from './routes/entrada.js';
import { clientRouter } from './routes/client.js';
import { productDetailRouter } from './routes/productdetail.js';
import { employeeRouter } from './routes/employee.js';
import { requisitionRouter } from './routes/requisition.js';
import { officeRouter } from './routes/office.js';
import { ordersRouter } from './routes/orders.js';
import { providerRouter } from './routes/proveedor.js';
import { outputRouter } from './routes/output.js';
import { orderDetailRouter } from './routes/orderdetail.js';

const app = express();

// Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/producto', productRouter);
app.use('/entrada', entryRouter );
app.use('/cliente', clientRouter);
app.use('/detalleproducto', productDetailRouter);
app.use('/empleados', employeeRouter);
app.use('/requisicion', requisitionRouter);
app.use('/oficina', officeRouter);
app.use('/ordenes', ordersRouter);
app.use('/proveedores', providerRouter);
app.use('/salida', outputRouter);
app.use('/detalleorden', orderDetailRouter);





// Iniciar el servidor en el puerto 6060
app.listen(6060, () => {
    console.log('Servidor escuchando en el puerto 6060');
});
