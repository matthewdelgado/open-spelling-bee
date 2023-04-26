// Import the shallowMount function from the @vue/test-utils library
import { shallowMount } from '@vue/test-utils';

// Import the Hive component from the Hive.vue file
import Hive from '@/components/Hive.vue';

// Begin the Jest test suite for the Hive component
describe('Hive.vue', () => {

  // Begin the test to check that the component renders the correct user guess
  it('renders the correct user guess', () => {
    // Create a new shallow-mount wrapper for the Hive component
    const wrapper = shallowMount(Hive);

    // Define a userGuess string to test with
    const userGuess = 'example';

    // Set the userGuess data property on the component using the setData method
    wrapper.setData({ userGuess });

    // Expect that the text of the .user-guess element in the wrapper matches the uppercase version of the userGuess string
    expect(wrapper.find('.user-guess').text()).toMatch(userGuess.toUpperCase());
  });

  // Begin the test to check that the submitGuess method is called when the submit button is clicked
  it('calls submitGuess method when the submit button is clicked', () => {
    // Create a new shallow-mount wrapper for the Hive component
    const wrapper = shallowMount(Hive);

    // Find the submit button element in the wrapper
    const submitButton = wrapper.find('.hive-action__submit');

    // Create a new Jest mock function to replace the actual submitGuess method on the component
    const submitGuess = jest.fn();

    // Set the submitGuess method on the component to the mock function
    wrapper.vm.submitGuess = submitGuess;

    // Trigger a click event on the submit button
    submitButton.trigger('click');

    // Expect that the submitGuess method was called
    expect(submitGuess).toHaveBeenCalled();
  });

  // Begin the test to check that the time value is decremented every second
  it('decrements the time value every second', async () => {
    // Use Jest's fake timers to simulate the passage of time
    jest.useFakeTimers();

    // Create a new shallow-mount wrapper for the Hive component
    const wrapper = shallowMount(Hive);

    // Save the initial value of the time data property on the component
    const initialTime = wrapper.vm.time;

    // Advance the timer by one second
    jest.advanceTimersByTime(1000);

    // Wait for the Vue instance to update
    await wrapper.vm.$nextTick();

    // Expect that the time data property on the component has been decremented by one
    expect(wrapper.vm.time).toBe(initialTime - 1);

    // Restore Jest's real timers
    jest.useRealTimers();
  });
});
