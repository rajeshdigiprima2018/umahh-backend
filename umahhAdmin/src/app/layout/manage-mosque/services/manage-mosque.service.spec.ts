import { TestBed, inject } from '@angular/core/testing';

import { ManageContentService } from './manage-content.service';

describe('ManageContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageContentService]
    });
  });

  it('should be created', inject([ManageContentService], (service: ManageContentService) => {
    expect(service).toBeTruthy();
  }));
});
