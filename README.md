*********UTILIZACIÓN DE LOS PLUGINS*********

TOAST

npm install toast

* Momento: Cuando el usuario guarda una asistencia.
* Razón: Para hacer la interacción más visualmente atractiva.

--------------------------------------

VIBRATION

npm install --save @ionic-native/vibration

* Momento: Cuando el usuario guarda una asistencia.
* Razón: Para permitir recibir una confirmación tactil.

--------------------------------------

AUDIO

npm install @ionic-native/native-audio

* Momento: Cuando el usuario guarda una asistencia.
* Razón: Para que el usuario oiga que se guardo correctamente la asistencia.
* Momento: Cuando el usuario comete un error.
* Razón: Para que el usuario tenga presente su equivocación.

--------------------------------------------

DEVICE MOTION

npm install @ionic-native/device-motion

* Momento: Cuando el alumno está revisando sus asistencia y agita el celular acercandolo y alejandolo de su cara.
* Razón: Para que el alumno pueda facilmente resetear sus elecciones y limpiar la pantalla.

--------------------------------------------

DEVICE

npm install @ionic-native/device

* Momento: Cuando el usuario ingresa al modulo de asistencias, se guarda el SO, version, fabricante del celular y modelo.
* Razón: Para que los desarrolladores puedan llevar registro de la población que constituye los usuarios de la app.

----------------------------------------------

CAMERA

$ ionic cordova plugin add cordova-plugin-camera
$ npm install --save @ionic-native/camera

* Momento: Cuando el usuario ingresa al modulo de personas, y modifica o crea un usuario
* Razón: Para que el usuario pueda cargar su foto

----------------------------------------------

BARCODE SCANNER

$ ionic cordova plugin add phonegap-plugin-barcodescanner
$ npm install --save @ionic-native/barcode-scanner

* Momento: Cuando la administrativa quiere seleccionar un aula.
* Razón: Para que ahorrarle trabajo a la administrativa y permitirle una forma alternativa de seleccionar el aula.

--------------------------------------------------------------------------------------------

TRANSLATE

* Momento: En toda la aplicación.
* Razón: Para adecuar la aplicación al lenguaje del usuario.

----------------------------------------------

GOOGLEMAP

* Momento: Al ingresar al submenu de localización.
* Razón: Para mostrar de forma visual el cambio de formato regional.

----------------------------------------------


OTROS

npm install email-validator
npm install firebase angularfire2 --save

----------------------------------------------


IONIC VIEW
* 0ead0d31