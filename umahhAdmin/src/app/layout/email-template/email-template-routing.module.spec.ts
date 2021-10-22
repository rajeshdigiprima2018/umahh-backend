import { EmailTemplateRoutingModule } from './email-template-routing.module';

describe('EmailTemplateRoutingModule', () => {
  let emailTemplateRoutingModule: EmailTemplateRoutingModule;

  beforeEach(() => {
    emailTemplateRoutingModule = new EmailTemplateRoutingModule();
  });

  it('should create an instance', () => {
    expect(emailTemplateRoutingModule).toBeTruthy();
  });
});
