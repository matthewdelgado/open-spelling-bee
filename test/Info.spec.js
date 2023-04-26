import { shallowMount } from '@vue/test-utils';
import Info from '@/components/Info.vue';

describe('Info.vue', () => {
  it('renders the correct help text', () => {
    const wrapper = shallowMount(Info, {
      mocks: {
        $t: (key) => key,
      },
    });
    const helpText = `
      <h3>Help Creating Words</h3>
      <ul>
        <li>Word Rule 1.</li>
        <li>Word Rule 2.</li>
        <li>Word Rule 3.</li>
      </ul>
      <h3>Help Scoring Points</h3>
      <ul>
        <li>Points Rule 1.</li>
        <li>Points Rule 2.</li>
        <li>Points Rule 3A. Points Rule 3B!</li>
      </ul>
    `;
    expect(wrapper.html()).toContain(helpText);
  });

  it('applies the correct styles', () => {
    const wrapper = shallowMount(Info);
    expect(wrapper.classes()).toContain('info-dialog');
    expect(wrapper.find('.info-dialog').attributes('style')).toMatch('text-align: left;');
  });
});
