import { ManageMosqueRoutingModule } from './manage-mosque-routing.module';

describe('ManageMosqueRoutingModule', () => {
  let manageMosqueRoutingModule: ManageMosqueRoutingModule;

  beforeEach(() => {
    manageMosqueRoutingModule = new ManageMosqueRoutingModule();
  });

  it('should create an instance', () => {
    expect(manageMosqueRoutingModule).toBeTruthy();
  });
});
