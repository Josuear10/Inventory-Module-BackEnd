import oracledb from 'oracledb';

export async function connectToDB() {
    const connection = await oracledb.getConnection({
        user: 'Admin_INV',
        password: '1234',
        connectString: 'localhost/orcl'
    });
    return connection;
}
