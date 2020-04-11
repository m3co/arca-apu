# arca-apu
Administrador de APU para contratistas y en general

## Proposito
Esta aplicacion ofrece una interfaz para que el contratista pueda administrar sus APU.
Cada proyecto debe contener sus propias APU[1]

## Caracteristicas
La interfaz se compone de

- Seleccionador de proyecto
- Listado en forma de arbol de las APU del contratista
- Al seleccionar un capitulo o un subcapitulo o un item, se debe mostrar el listado de las APU en dicho capitulo, subcapitulo seleccionado, o simplemente una sola APU para el item seleccionado
- El listado de las APU muestra el encabezado de la APU y sus insumos correspondientes
- El listado de insumos permite: agregar, actualizar o eliminar insumos uno a uno. Asi como tambien permite importar mediante un copiar-y-pegar de Excel u otra fuente.
- La accion de importar mediante un copiar-y-pegar requiere que los datos a pegar vengan en un formato especifico.
- La accion de importar mediante un copiar-y-pegar muestra una vista preliminar del resultado de pegar. Una vez aceptados los datos entonces se procede con la accion de importar los datos llevandolos a ARCA.

## Rationale
Los maestros de obra tienen una gran cantidad de APU listas para utilizar. La motivacion detras de esta aplicacion es ayudarle al maestro a tener sus APU atadas al proyecto.

Se podria pensar en hacer un listado suelto, sin anclar a un proyecto, y luego de ese listado simplemente unir una activdidad con una APU. La experiencia dice que dicha comodidad trae malentendidos.

Por lo tanto, el procedimiento correcto es exigirle al maestro de obra diligenciar los insumos de la APU uno a uno. Como ayuda se ofrece la posiblidad de hacer copiar-y-pegar.

Mas adelante esta aplicacion se tornaria en un almacenador de las APU sueltas.

Ademas tengase presente que esta aplicacion hace parte de un proceso mas amplio denominado "licitacion".

Durante las licitaciones si se debe aceptar anclarle a una actividad una APU existente. Ese tema se abordaria eventualmente en otra aplicacion.
