App = Ember.Application.create({});
App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Almacen = DS.Model.extend({
  title: DS.attr('string'),
  author: DS.attr('string'),
  date: DS.attr('string'),
  body: DS.attr('string')
});


App.Almacen.FIXTURES = [{
  id: '0',
  title: "Android KitKat la nueva versión de Google",
  author: "TicBeat",
  date: new Date('09-04-2013'),
  body: "La versión 4.4 de Android, la próxima del sistema operativo móvil de Google, se llamará KitKat, como la popular chocolatina de Nestle. Así lo ha dado a conocer Sundar Pichai, el máximo responsable del desarrollo de Android, en un tuit. La compañía, además, ha desarrollado un site en el que no solo recuerda que la plataforma ya la utilizan 1.000 millones de smartphones y tabletas sino que repasa todos los nombres que ha tenido el sistema desde que nació."
},{
  id: '1',
  title: "¿En qué estado está Ubuntu Touch para smartphones?",
  author: "Javier Pastor",
  date: new Date('06-14-2013'),
  body: "Ubuntu, una de las alternativas más interesantes en el segmento de la movilidad lleva cierto tiempo evolucionando en la sombra. Desde que aparecieran las ediciones para desarrolladores —Ubuntu Touch Developer Preview— el equipo de Canonical ha pasado a una segunda fase: la de utilizar Ubuntu en sus smartphones para evaluar su funcionamiento de primera mano. Ese proceso de dogfooding comenzó hace unas semanas, y hace poco Jono Bacon, Community Manager de Ubuntu, publicó un vídeo con sus impresiones sobre el estado actual de Ubuntu en smartphones. Las cosas, como indicaba este portavoz de Canonical, son cada vez más prometedoras. En el repaso a las características de Ubuntu en smartphones Bacon indica que la mayoría de las funciones básicas funcionan correctamente en su Galaxy Nexus con Ubuntu Touch Developer Preview. Se han implementado ya mejoras interesantes e importantes, como los modos de ahorro de energía que apagan la pantalla tras cierto tiempo. Por supuesto es posible hacer y recibir llamadas, mandar y recibir mensajes SMS, y obtener notificaciones de estos y otros eventos. El sistema de notificaciones es especialmente singular por que al desplazar hacia abajo el tope de la pantalla aparecen esas notificaciones, pero agrupadas en pseudopestañas a las que accedemos deslizando esa pantalla de notificaciones a izquierda y derecha. Aunque la interfaz de algunas aplicaciones es particularmente básica —me ha sorprendido el aspecto de la aplicación que muestra el tiempo, por ejemplo— lo cierto es que el vídeo parece demostrar que buena parte de lo que un usuario podría esperar de su teléfono ya está funcionando en Ubuntu Touch Developer Preview."  
}];

App.Router.map(function() {
  this.resource('about');
  this.resource('gallery');
  this.resource('posts', function() {
    this.resource('post', { path: ':post_id' });
    this.resource('newpost');       });
});

App.PostsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('almacen');  }
});

App.GalleryRoute = Ember.Route.extend({
  redirect: function(){
    this.transitionTo('gallery'); }
});

App.IndexRoute = Ember.Route.extend({
  redirect: function(){
    this.transitionTo('posts');  }
});

App.PostRoute = Ember.Route.extend({
  model: function(params) {
  return App.Almacen.FIXTURES.findBy('id', params.post_id);  }
 });

App.PostController = Ember.ObjectController.extend({
  isEditing: false,

  edit: function() {
    this.set('isEditing', true);
  },

  doneEditing: function() {
    this.set('isEditing', false);
    this.get('model').commit();
  },
  
  delete: function () {
    var almacen = this.get('model');
    almacen.deleteRecord();
    almacen.save();
    this.transitionTo('index');
   }
 });

App.NewpostController = Ember.ArrayController.extend({
  
    createPost: function () {
      // Captura la informacion introducida por el usuario
      var title = this.get('newTitle');
      var author = this.get('newAuthor');
      var body = this.get('newBody');
      //Variable para capturar la fecha del sistema
      var f = new Date();
      // Crea el nuevo registro del modelo
      var todo = this.store.createRecord('almacen', {
        title: title,
        author: author,
        date: new Date((f.getMonth() +1) + "-" +f.getDate() + "-" + f.getFullYear()+":"+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()),
        body: body
      });
      // Limpia el formulario
      this.set('newTitle', '');
      this.set('newAuthor', '');
      this.set('newBody', '');
      // Save the new model
      //almacen.save();
      }
});


var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});

Ember.Handlebars.helper('format-date', function(date) {
  return moment(date).fromNow();
});

$(function() {
$(".image").click(function() {
var image = $(this).attr("rel");
$('#image').hide();
$('#image').fadeIn('slow');
$('#image').html('<img src="' + image + '"/>');
return false;
  });
});
