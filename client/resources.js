class Resources {
  constructor() {
    this.plants = {};
    this.buildings = {};
    this.items = {};
    this.animals = {};
    this.obstacles = {};
    this.map = {};
    this.names = {};
    this.buildingNames = {}
    this.names.buildings = [];
    this.buildingNames.bakery = ["bakery", 'crusher', 'dairy', 'sugar_factory', 'popcorn_maker', 'grill', 'oven', 'loom', 'juicer']
    this.buildingNames.garden = ["garden"]
    this.buildingNames.animalPen = ['coop', 'cowshed', 'pigsty', 'sheepfold']
    this.buildingNames.bush = ['cranberry', 'apple_tree', 'raspberry', 'cherry', 'blackberry', 'strawberry']
    this.buildingNames.serviceBuildings = ['barn'];
    for (const type in this.buildingNames) {
      this.buildingNames[type].forEach(name => {
        this.names.buildings.push(name)
      });
    }
    this.names.plants = ["wheat", "corn", 'carrot', 'soy', 'sugarCane', 'carrot', 'pumpkin', 'indigo', 'pepper', 'tomato', 'cotton', 'potato'];
    this.names.items = ['tomatoJuice', 'brownSugar', 'pancakes', 'butterPopcorn',
      'carrotJuice', 'blackberryCupcake', 'redScarf', 'omelet', 'applePie', 'cookie',
      'pigFeed', 'sweetPopcorn', 'cherryJuice', 'creamCake', 'raspberryCupcake',
      'blueCap', 'chickenFeed', 'berryJuice', 'hamburger', 'cherryPie', 'spicyPizza',
      'carrotCake', 'appleJuice', 'cornbread', 'syrup', 'pizza', 'cheese', 'cream',
      'whiteSugar', 'potatoBread', 'carrotPie', 'popcorn', 'chilePopcorn', 'purpleDress',
      'blueSweater', 'bakedTomato', 'strawberryCake', 'pumpkinPie', 'cheesecake', 'bread',
      'sweater', 'cottonFabric', 'sheepFeed', 'cowFeed', 'bakedPotato', 'shirt', 'shorts',
      'baconPie', 'butter']; //только крафты
    this.names.animals = ['chicken', 'cow', 'pig', 'sheep'];
    this.names.obstacles = ["small_swamp"];
    this.mapImgNames = ["grass_1", "grass_2"];
  }
}

const RES = new Resources();

export default RES;

