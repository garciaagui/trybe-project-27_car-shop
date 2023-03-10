import { expect } from 'chai';
import sinon from 'sinon';
import { Model } from 'mongoose';
import Car from '../../../src/Domains/Car';
import CarService from '../../../src/Services/CarService';
import { validInput, validUpdateInput } from './Mocks/carMocks';

describe('Atualização de carros [Service]', function () {
  afterEach(function () {
    sinon.restore();
  });
  
  it('Retorna o carro atualizado com SUCESSO', async function () {
    // Arrange
    const id = '63320b77aa12f0db4f210afe';
    const findOutput = new Car({ id, ...validInput });
    const updateOutput = new Car({ id, ...validUpdateInput });

    sinon.stub(Model, 'findOne').resolves(findOutput);
    sinon.stub(Model, 'updateOne').resolves();

    // Act
    const service = new CarService();
    const result = await service.updateById(id, validUpdateInput);

    // Assert
    expect(result).to.be.deep.equal(updateOutput);
  });

  it('Retorna uma EXCEÇÃO quando nenhum carro for encontrado', async function () {
    // Arrange
    const noCarId = '63320b77aa12f0db4f210aff';

    sinon.stub(Model, 'findOne').resolves(null);
    sinon.stub(Model, 'updateOne').resolves();

    // Act
    try {
      const service = new CarService();
      await service.updateById(noCarId, validUpdateInput);
    } catch (error) {
      // Assert
      expect((error as Error).message).to.be.equal('Car not found');
    } 
  });

  it('Retorna uma EXCEÇÃO quando o id for inválido', async function () {
    // Arrange
    const invalidId = 'xxx';

    sinon.stub(Model, 'findOne').resolves(null);
    sinon.stub(Model, 'updateOne').resolves();

    // Act
    try {
      const service = new CarService();
      await service.updateById(invalidId, validUpdateInput);
    } catch (error) {
      // Assert
      expect((error as Error).message).to.be.equal('Invalid mongo id');
    }
  });
});