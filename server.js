import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { productRouter } from './routes/product.js';
import { entryRouter } from './routes/entrada.js';
import { rentryRouter } from './routes/reporteentrada.js';
import { clientRouter } from './routes/client.js';
import { productDetailRouter } from './routes/productdetail.js';
import { employeeRouter } from './routes/employee.js';
import { requisitionRouter } from './routes/requisition.js';
import { officeRouter } from './routes/office.js';
import { ordersRouter } from './routes/orders.js';
import { providerRouter } from './routes/proveedor.js';
import { outputRouter } from './routes/output.js';
import { orderDetailRouter } from './routes/orderdetail.js';
import { routputRouter } from './routes/reportesalida.js';
import { kardexRouter } from './routes/kardex.js';
import { TopProductsRouter } from './routes/reportetopproductos.js';
import { TopProveedoresRouter } from './routes/reportetopproveedores.js';
import { ProductStockRouter } from './routes/reportestock.js';
import { loginRouter} from './routes/login.js';
const app = express();

// Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/producto', productRouter);
app.use('/entrada', entryRouter );
app.use('/rentrada', rentryRouter );
app.use('/kardex', kardexRouter);
app.use('/rsalida', routputRouter );
app.use('/cliente', clientRouter);
app.use('/detalleproducto', productDetailRouter);
app.use('/empleados', employeeRouter);
app.use('/requisicion', requisitionRouter);
app.use('/oficina', officeRouter);
app.use('/ordenes', ordersRouter);
app.use('/proveedores', providerRouter);
app.use('/salida', outputRouter);
app.use('/topproductos', TopProductsRouter);
app.use('/stock', ProductStockRouter);
app.use('/topproveedores', TopProveedoresRouter);
app.use('/detalleorden', orderDetailRouter);
app.use("/login", loginRouter);




// Iniciar el servidor en el puerto 6060
app.listen(6060, () => {
    console.log('Servidor escuchando en el puerto 6060');
});
