import { ManageContentModule } from './manage-content.module';

describe('ManageContentModule', () => {
  let manageContentModule: ManageContentModule;

  beforeEach(() => {
    manageContentModule = new ManageContentModule();
  });

  it('should create an instance', () => {
    expect(manageContentModule).toBeTruthy();
  });
});
