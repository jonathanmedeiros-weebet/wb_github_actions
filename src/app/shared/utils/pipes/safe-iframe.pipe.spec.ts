import { SafeIframePipe } from './safe-iframe.pipe';

describe('SafeIframePipe', () => {
  it('create an instance', () => {
    const pipe = new SafeIframePipe();
    expect(pipe).toBeTruthy();
  });
});
