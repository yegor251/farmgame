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
    this.buildingNames.bakery = ["bakery", 'crusher', 'dairy', 'juicer', 'loom', 'oven', 'popcorn_maker', 'sugar_factory']
    this.buildingNames.garden = ["garden"]
    this.buildingNames.animalPen = ['coop', 'cowshed', 'pigsty', 'sheepfold']
    this.buildingNames.bush = ['cranberry', 'apple_tree', 'raspberry', 'cherry', 'blackberry', 'strawberry']
    this.buildingNames.serviceBuildings = ['barn'];
    for (const type in this.buildingNames) {
      this.buildingNames[type].forEach(name => {
        this.names.buildings.push(name)
      });
    }
    this.names.plants = ["wheat", "pizdec"];
    this.names.items = ["bread", 'cream', 'popcorn', 'sweetPopcorn', 'syrup', 'whiteSugar', 
    'chilePopcorn', 'brownSugar', 'butter', 'butterPopcorn', 'cheese', 'bread', 'chickenFeed', 
    'potatoBread', 'blackberryCupcake', 'cookie', 'cornbread', 'pizza', 'raspberryCupcake', 
    'spicyPizza', 'cowFeed', 'sheepFeed', 'pigFeed', 'sweater', 'cottonFabric', 'blueCap', 
    'shirt', 'blueSweater', 'shorts', 'purpleDress']; //только крафты
    this.names.animals = ['chicken', 'cow', 'pig', 'sheep'];
    this.names.obstacles = ["small_swamp"];
    this.mapImgNames = ["grass_1", "grass_2"];
  }
}

const RES = new Resources();

export default RES;

