const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

//implementar lib para recargar views
if (process.env.NODE_ENV !== 'producction') {
    require('electron-reload')(__dirname, {
    })
}

let inicioWindow
let productoWindow

app.on('ready', () => {
    //crear ventana principal
    inicioWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    inicioWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/inicio.html'),
        protocol: 'file',
        slashes: true
    }))

    //asignar menu template
    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    //
    inicioWindow.on('close', () => {
        app.quit();
    })
});

function crearNuevoProducto() {
    productoWindow = new BrowserWindow({
        width: 400,
        height: 330,
        title: 'Agregar Nuevo Producto',
        webPreferences: {
            nodeIntegration: true
        }
    });
    //productoWindow.setMenu(null);
    productoWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/producto.html'),
        protocol: 'file',
        slashes: true
    }))

    //evento close para view hijo
    productoWindow.on('close', () => {
        productoWindow = null;
    })
}

//leer data desde new-product y enviar a index
ipcMain.on('producto:nuevo', (e, nuevoProducto) => {
    inicioWindow.webContents.send('producto:nuevo',nuevoProducto);
    productoWindow.close();
});

//definir template menu
const templateMenu = [
    {
        label: 'Archivo',
        submenu: [
            {
                label: 'Nuevo Producto',
                accelerator: 'Ctrl+N',
                click() {
                    crearNuevoProducto();
                }
            },
            {
                label: 'Eliminar todos los productos',
                click() {
                    inicioWindow.webContents.send('productos:eliminar');
                }
            },
            {
                label: 'Salir',
                accelerator: 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

//mostrar dev tools si es produccion
if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'Dev-Tools',
        submenu: [
            {
                label: 'Mostrar/Ocultar Dev Tools',
                click(item, focusedWindows) {
                    focusedWindows.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}