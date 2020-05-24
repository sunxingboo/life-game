import {WorldWidth, WorldHeight, LifeSize} from "./environment/Constants.js";
import {World} from "./environment/World.js";

const NewWorld = new World("world", WorldWidth, WorldHeight, LifeSize);
NewWorld.start();
