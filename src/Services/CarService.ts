import { isValidObjectId } from 'mongoose';
import Car from '../Domains/Car';
import ICar from '../Interfaces/ICar';
import CarODM from '../Models/CarODM';
import NotFoundException from '../Exceptions/NotFound';
import UnprocessableException from '../Exceptions/Unprocessable';

const CAR_NOT_FOUND_MESSAGE = 'Car not found';
const INVALID_ID_MESSAGE = 'Invalid mongo id';

class CarService {
  private createCarDomain(car: ICar | null): Car | null {
    if (car) {
      const { id, model, year, color, status, buyValue, doorsQty, seatsQty } = car;
      return new Car({
        id,
        model,
        year,
        color,
        status,
        buyValue,
        doorsQty,
        seatsQty });
    }
    return null;
  }

  public async create(car: ICar) {
    const carODM = new CarODM();
    const newCar = await carODM.create(car);
    return this.createCarDomain(newCar);
  }

  public async getAll() {
    const carODM = new CarODM();
    const cars = await carODM.getAll();
    const carsArr = cars.map((car) => this.createCarDomain(car));
    return carsArr;
  }

  public async getById(id: string) {
    if (!isValidObjectId(id)) throw new UnprocessableException(INVALID_ID_MESSAGE);

    const carODM = new CarODM();
    const foundCar = await carODM.getById(id);

    if (!foundCar) {
      throw new NotFoundException(CAR_NOT_FOUND_MESSAGE);
    }

    return this.createCarDomain(foundCar);
  }

  public async updateById(id: string, car: ICar) {
    this.validateById(id);
    
    const carODM = new CarODM();
    await carODM.updateById(id, car);
    return this.createCarDomain({ id, ...car });
  }

  public async deleteById(id: string) {
    this.validateById(id);
    
    const carODM = new CarODM();
    return carODM.deleteById(id);
  }

  private async validateById(id: string) {
    if (!isValidObjectId(id)) throw new UnprocessableException(INVALID_ID_MESSAGE);
  
    const foundCar = await this.getById(id);
    if (!foundCar) throw new NotFoundException(CAR_NOT_FOUND_MESSAGE);
  }
}

export default CarService;