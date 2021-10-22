import { UsersModule } from './users.module';

describe('ChartsModule', () => {
    let chartsModule: UsersModule;

    beforeEach(() => {
        chartsModule = new UsersModule();
    });

    it('should create an instance', () => {
        expect(chartsModule).toBeTruthy();
    });
});
