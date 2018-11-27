

/**  * MapData.js  * 
* @description :: A model definition.  Represents a database table/collection/etc.  * @docs        :: https://sailsjs.com/docs/concepts/models-andorm/models  */ 
 
module.exports = { 
 
  attributes: { 
 
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗     //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗     //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝     title : 'string',     resize : 'boolean',     recenter : 'boolean',     mapType : 'string',      screenSize : 'string',     latitude : 'number',     longitude : 'number', 
 
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗     //  ║╣ ║║║╠╩╗║╣  ║║╚═╗     //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝ 
 
 
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗     //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗     //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝ 
 
  }, 
 
}; sails.config.models.migrate='alter'; 