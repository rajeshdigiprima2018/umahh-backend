import { TestBed, inject } from '@angular/core/testing';

import { MosqueService } from './mosque.service';

describe('MosqueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MosqueService]
    });
  });

  it('should be created', inject([MosqueService], (service: MosqueService) => {
    expect(service).toBeTruthy();
  }));
});
