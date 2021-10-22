import { TestBed, inject } from '@angular/core/testing';

import { UserComponentService } from './user-component.service';

describe('UserComponentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserComponentService]
    });
  });

  it('should be created', inject([UserComponentService], (service: UserComponentService) => {
    expect(service).toBeTruthy();
  }));
});
