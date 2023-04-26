import { shallowMount } from '@vue/test-utils';
import CorrectGuesses from '@/components/CorrectGuesses.vue';

describe('CorrectGuesses.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(CorrectGuesses);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays correct number of correct guesses', () => {
    const store = {
      getCorrectGuesses: ['apple', 'banana', 'cherry', 'date'],
      cellClassName: () => {},
    };
    const wrapper = shallowMount(CorrectGuesses, {
      global: {
        provide: {
          useMainStore: () => store,
        },
      },
    });
    const title = wrapper.find('[slot="title"]');
    expect(title.text()).toBe('Found 4 words.');
  });

  it('displays "Your words" when there are no correct guesses', () => {
    const store = {
      getCorrectGuesses: [],
      cellClassName: () => {},
    };
    const wrapper = shallowMount(CorrectGuesses, {
      global: {
        provide: {
          useMainStore: () => store,
        },
      },
    });
    const title = wrapper.find('[slot="title"]');
    expect(title.text()).toBe('Your words...');
  });

  it('displays last five correct guesses', () => {
    const store = {
      getCorrectGuesses: ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape'],
      cellClassName: () => {},
    };
    const wrapper = shallowMount(CorrectGuesses, {
      global: {
        provide: {
          useMainStore: () => store,
        },
      },
    });
    const guessSpans = wrapper.findAll('.guess');
    expect(guessSpans.length).toBe(5);
    expect(guessSpans.at(0).text()).toBe('grape');
    expect(guessSpans.at(1).text()).toBe('fig');
    expect(guessSpans.at(2).text()).toBe('elderberry');
    expect(guessSpans.at(3).text()).toBe('date');
    expect(guessSpans.at(4).text()).toBe('cherry');
  });
});
