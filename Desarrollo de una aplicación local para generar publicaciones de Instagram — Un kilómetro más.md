# **Desarrollo de una aplicación local para generar publicaciones de Instagram — Un kilómetro más**

## **1\. Objetivo del proyecto**

Desarrollar una aplicación web que se ejecute en local y permita crear, editar y exportar imágenes para Instagram a partir de una plantilla gráfica reutilizable de la marca **Un kilómetro más**.

La aplicación debe permitir modificar las imágenes, los textos, la numeración del reto y las estadísticas de cada entrenamiento, manteniendo una identidad visual coherente entre publicaciones.

El objetivo es que preparar una nueva publicación diaria sea un proceso rápido, visual y sencillo, sin necesidad de utilizar herramientas externas de diseño gráfico.

## **2\. Contexto e identidad visual**

La marca «Un kilómetro más» representa una aventura personal relacionada con el running, la superación y los retos a largo plazo.

La identidad visual definida hasta ahora utiliza:

* Fondo oscuro, principalmente negro.  
* Naranja intenso como color de acento.  
* Texto blanco de alto contraste.  
* Estética deportiva, aventurera y cinematográfica.  
* Fotografías de running, carreteras, entrenamientos y amaneceres.  
* Elementos gráficos relacionados con la marca, incluyendo el logotipo de «Un kilómetro más».  
* Una composición editorial con textos destacados y estadísticas de entrenamiento.

La aplicación debe utilizar la composición gráfica actual como referencia inicial, pero permitir adaptar la plantilla sin tener que modificar el código.

## **3\. Funcionalidades principales**

### **3.1. Editor visual con previsualización**

La interfaz principal debe mostrar una previsualización de la publicación, manteniendo las proporciones y dimensiones del formato de destino.

Debe permitir:

* Visualizar los cambios en tiempo real.  
* Seleccionar un elemento de la composición para editarlo.  
* Mover los elementos mediante arrastrar y soltar.  
* Cambiar el tamaño y la posición de las imágenes.  
* Editar textos directamente desde un panel de propiedades.  
* Duplicar, ocultar y eliminar elementos.  
* Deshacer y rehacer cambios.  
* Restablecer la composición a la plantilla original.

La edición debe ser visual y no requerir conocimientos de programación.

### **3.2. Sustitución de imágenes**

Cada imagen de la plantilla debe poder sustituirse de manera independiente.

Se necesitan, como mínimo, los siguientes elementos:

**A. Imagen del mapa**

* Sustituir la imagen del mapa por otra captura del entrenamiento.  
* Permitir seleccionar un archivo desde el ordenador.  
* Ajustar el encuadre y la escala de la imagen.  
* Mover la imagen dentro de su contenedor.  
* Recortar la imagen sin deformarla.  
* Ajustar su posición dentro de la composición.  
* Poder ocultarla cuando no se quiera mostrar el recorrido.

**B. Imagen central de la zona izquierda**

Es la imagen principal de la publicación, situada en la parte izquierda de la composición actual. Representa el running y proporciona el contexto visual de la aventura.

Debe permitir:

* Sustituir la fotografía por otra imagen.  
* Importar archivos PNG, JPG y WebP.  
* Ajustar escala, posición y encuadre.  
* Recortar la imagen.  
* Controlar su transparencia.  
* Aplicar, si resulta sencillo, ajustes básicos de brillo y contraste.  
* Mostrar la imagen por delante o por detrás de otros elementos.

La sustitución de una imagen no debe alterar automáticamente el resto de la composición.

**C. Logotipo de la marca**

* Utilizar el logotipo actual de «Un kilómetro más».  
* Permitir sustituirlo por una versión actualizada.  
* Controlar su posición, tamaño y visibilidad.  
* Mantener su proporción original.  
* Poder bloquearlo para evitar modificaciones accidentales.

Las imágenes deben almacenarse localmente o incorporarse al proyecto sin depender de servicios externos.

### **3.3. Edición de textos**

Todos los textos deben ser editables individualmente.

Como mínimo, la plantilla inicial debe incluir:

* Nombre de la marca.  
* Título del reto.  
* Número del reto: `1/100`, `2/100`, `3/100`, etc.  
* Indicador del día: `DÍA 1/100`.  
* Objetivo: `5 KM DIARIOS`.  
* Texto central o reflexión del día.  
* Frase de cierre.  
* Distancia recorrida.  
* Tiempo total.  
* Ritmo medio.  
* Frecuencia cardíaca media.  
* Calorías, si se desea mostrar este dato.  
* Fecha y hora del entrenamiento.

Cada texto debe permitir modificar:

* Contenido.  
* Tamaño de fuente.  
* Tipografía.  
* Color.  
* Grosor y estilo.  
* Alineación.  
* Posición.  
* Interlineado.  
* Espaciado entre caracteres.  
* Opacidad.  
* Visibilidad.

La aplicación debe permitir que el texto ocupe varias líneas y adaptar el tamaño o el interlineado cuando sea necesario para evitar que se salga de su contenedor.

No se deben modificar automáticamente los textos que el usuario no haya seleccionado.

### **3.4. Numeración secuencial del reto**

La aplicación debe incorporar un control específico para la numeración de los retos.

Ejemplo:

* Día 1 → `RETO 1/100`  
* Día 2 → `RETO 2/100`  
* Día 3 → `RETO 3/100`  
* Día 100 → `RETO 100/100`

Debe ser posible:

* Establecer el número inicial.  
* Modificar manualmente el número del día.  
* Establecer el total de días del reto.  
* Actualizar automáticamente todas las etiquetas vinculadas a la numeración.  
* Avanzar al siguiente día mediante un botón.  
* Volver a un día anterior sin perder la información guardada.

El número del reto y el número del día deben estar vinculados por defecto, pero el usuario podrá desvincularlos si necesita una numeración diferente.

**Importante:** avanzar el contador no debe sobrescribir los datos de entrenamientos anteriores ni cambiar las estadísticas sin confirmación.

### **3.5. Capas y orden de los elementos**

Este requisito es fundamental.

La aplicación debe permitir controlar qué elementos aparecen delante o detrás de los demás, como en un editor gráfico.

Cada elemento de la composición debe pertenecer a una capa independiente.

Ejemplos:

* Fondo general.  
* Fotografía principal.  
* Efectos de iluminación.  
* Logotipo.  
* Imagen del mapa.  
* Panel de estadísticas.  
* Títulos.  
* Textos descriptivos.  
* Elementos decorativos.

El editor debe incluir un panel de capas que permita:

* Seleccionar una capa.  
* Arrastrarla para cambiar su posición en el orden.  
* Enviar al fondo.  
* Traer al frente.  
* Avanzar una posición.  
* Retroceder una posición.  
* Ocultar o mostrar una capa.  
* Bloquear o desbloquear una capa.  
* Cambiar el nombre de una capa.

El orden de las capas debe determinar el orden real de renderizado y exportación.

El usuario debe poder, por ejemplo, colocar la fotografía principal detrás del texto, situar el mapa delante de la fotografía o mover el logotipo al primer plano.

### **3.6. Estadísticas del entrenamiento**

Debe existir un panel específico para editar los datos de cada sesión.

Campos iniciales:

* Distancia en kilómetros.  
* Tiempo total.  
* Ritmo medio.  
* Frecuencia cardíaca media.  
* Calorías.  
* Desnivel positivo.  
* Fecha y hora.

Los campos opcionales deben poder ocultarse sin dejar espacios vacíos innecesarios en el diseño.

La aplicación no necesita integrarse con Garmin ni con ninguna otra plataforma en su primera versión. Los datos se introducirán manualmente y las capturas se importarán desde el ordenador.

En una futura versión se podría estudiar la importación automática de datos, pero no forma parte del alcance inicial.

### **3.7. Gestión de plantillas**

Debe existir una plantilla inicial que reproduzca la composición gráfica actual de «Un kilómetro más».

El usuario podrá:

* Abrir la plantilla original.  
* Guardar una composición como nueva plantilla.  
* Duplicar una plantilla.  
* Cambiar entre plantillas.  
* Restaurar una plantilla a su estado inicial.

Los cambios realizados al crear una publicación no deben modificar accidentalmente la plantilla original.

## **4\. Exportación de imágenes**

La aplicación debe permitir exportar la composición final como una imagen lista para publicar en Instagram.

Requisitos:

* Formato PNG.  
* Formato JPEG, si resulta sencillo de implementar.  
* Resolución de salida de 1080 × 1350 píxeles para publicaciones verticales de 4:5.  
* Posibilidad de mantener una versión alternativa de 1080 × 1080 píxeles.  
* Botón para exportar la imagen.  
* Nombre de archivo configurable, con una opción predeterminada como `un-kilometro-mas-dia-001.png`.

La imagen exportada debe incluir todos los elementos visibles, respetando su posición, tamaño, transparencia y orden de capas.

La exportación debe utilizar el tamaño final, independientemente de la escala de visualización del editor.

No deben aparecer controles, guías ni bordes de selección en la imagen exportada.

## **5\. Funcionamiento local y persistencia**

La aplicación debe ejecutarse en el ordenador del usuario sin necesitar un servidor remoto ni una cuenta de usuario.

Requisitos:

* Ejecutarse en local mediante los comandos habituales de desarrollo.  
* No requerir autenticación.  
* No enviar imágenes ni estadísticas a servicios externos.  
* Guardar localmente las preferencias y configuraciones.  
* Mantener las plantillas y los proyectos entre sesiones.  
* Permitir guardar y recuperar proyectos.  
* Ofrecer una opción para exportar e importar un proyecto completo, incluyendo los recursos gráficos necesarios.

Para el almacenamiento persistente se puede utilizar IndexedDB para los proyectos e imágenes, y localStorage para preferencias sencillas.

No se debe depender exclusivamente de memoria temporal del navegador.

## **6\. Interfaz propuesta**

La aplicación debe tener una interfaz clara, en español y orientada a la edición visual.

Distribución sugerida:

**Zona central:**  
Previsualización de la publicación con el lienzo y los elementos seleccionables.

**Panel lateral izquierdo:**  
Listado de capas y controles para cambiar el orden, ocultar elementos o bloquearlos.

**Panel lateral derecho:**  
Propiedades del elemento seleccionado, incluyendo imagen, texto, posición, tamaño y estilos.

**Barra superior:**

* Abrir proyecto.  
* Guardar proyecto.  
* Deshacer.  
* Rehacer.  
* Restablecer plantilla.  
* Cambiar el formato de salida.  
* Exportar imagen.

**Panel de datos:**  
Formulario para actualizar el número del reto y las estadísticas de la carrera.

La interfaz debe adaptarse a diferentes tamaños de pantalla, aunque se priorizará el uso desde un ordenador.

## **7\. Arquitectura y tecnologías sugeridas**

Si no existe una base de código previa, se propone utilizar:

* React.  
* TypeScript.  
* Vite.  
* CSS moderno.  
* Un editor basado en Canvas o SVG con soporte para selección, transformación y orden de capas.  
* IndexedDB para el almacenamiento local.  
* Una biblioteca de renderizado que permita exportar composiciones a PNG con buena calidad.

Se puede evaluar Fabric.js o Konva para la gestión del lienzo y las capas.

La solución debe estar organizada por componentes y responsabilidades, evitando concentrar toda la lógica en un único componente.

Se recomienda separar:

* Gestión del proyecto.  
* Modelo de elementos gráficos.  
* Editor del lienzo.  
* Panel de propiedades.  
* Gestión de capas.  
* Gestión de plantillas.  
* Persistencia local.  
* Exportación de imágenes.

El proyecto debe utilizar tipado estricto de TypeScript y mantener una estructura fácil de ampliar.

## **8\. Criterios de aceptación**

La primera versión se considerará funcional cuando se cumplan estos puntos:

1. La aplicación se ejecuta en local y abre la plantilla inicial.  
2. El usuario puede sustituir la imagen del mapa sin alterar otras imágenes.  
3. El usuario puede sustituir la imagen principal de la izquierda.  
4. El usuario puede modificar todos los textos de la composición.  
5. Cambiar el número del reto actualiza automáticamente las etiquetas vinculadas.  
6. El usuario puede modificar las estadísticas del entrenamiento.  
7. El usuario puede mover, ocultar y ordenar las capas.  
8. Los cambios se muestran en la previsualización.  
9. El usuario puede guardar un proyecto y recuperarlo posteriormente.  
10. El usuario puede exportar una imagen PNG de 1080 × 1350 píxeles.  
11. La imagen exportada conserva correctamente las fuentes, los colores, las imágenes y el orden de las capas.  
12. La plantilla original permanece intacta al crear nuevas publicaciones.  
13. La aplicación funciona sin conexión a servicios externos después de instalar las dependencias necesarias.

## **9\. Plan de implementación**

Desarrollar la aplicación de forma incremental.

**Fase 1\. Plantilla y exportación**

* Crear el lienzo con las dimensiones de Instagram.  
* Reproducir la composición inicial.  
* Permitir sustituir las dos imágenes principales.  
* Permitir editar los textos y las estadísticas.  
* Exportar la imagen final.

**Fase 2\. Editor de capas**

* Añadir selección de elementos.  
* Incorporar movimiento y redimensionamiento.  
* Implementar el panel de capas.  
* Añadir controles de visibilidad y bloqueo.

**Fase 3\. Numeración y proyectos**

* Implementar la numeración secuencial.  
* Guardar y recuperar proyectos.  
* Crear y duplicar plantillas.  
* Añadir deshacer y rehacer.

**Fase 4\. Calidad y acabado**

* Revisar la exportación.  
* Validar diferentes longitudes de texto.  
* Comprobar que las imágenes no se deforman.  
* Añadir mensajes de error y validaciones.  
* Documentar la instalación y el uso.

Priorizar una primera versión funcional antes de incorporar características avanzadas.

## **10\. Entregables**

El agente debe proporcionar:

* Código fuente completo.  
* Estructura de carpetas organizada.  
* Dependencias y configuración necesarias.  
* Plantilla inicial de «Un kilómetro más».  
* Recursos gráficos iniciales organizados.  
* Instrucciones para instalar y ejecutar la aplicación.  
* Instrucciones para crear, guardar y exportar publicaciones.  
* Pruebas de los flujos principales.  
* Un README con los requisitos y comandos necesarios.

Antes de finalizar, comprobar que la aplicación se puede ejecutar desde cero siguiendo únicamente las instrucciones del README.

## **Instrucción final al agente**

Desarrolla una aplicación local funcional para generar publicaciones de Instagram de la marca «Un kilómetro más». Utiliza la composición gráfica actual como plantilla inicial y prioriza la sustitución independiente de imágenes, la edición de textos, las estadísticas, la numeración del reto y el control del orden de las capas.

No te limites a generar una maqueta estática. Los controles deben funcionar realmente, los cambios deben reflejarse en la previsualización y la exportación debe producir una imagen final válida.

Si alguna decisión técnica no está especificada, elige una solución sencilla, mantenible y coherente con el objetivo de trabajar de forma rápida desde un ordenador.

## Tecnología

construir un editor de lienzo con capas reales. Con React, TypeScript y una biblioteca como Fabric.js puedes tener una primera versión bastante práctica sin desarrollar todo el motor gráfico desde cero.

Para empezar, le daría al agente la imagen de la composición que acabamos de crear y el logotipo de la marca como recursos de referencia. Así podrá reproducir el diseño inicial con mucha más fidelidad.

El objetivo final: que cada día solo tengas que introducir las estadísticas, cambiar la foto si quieres, actualizar el texto y pulsar «Exportar». Todo lo demás debería quedar resuelto por la plantilla.

