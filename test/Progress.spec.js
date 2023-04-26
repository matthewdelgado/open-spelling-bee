import { mount } from '@vue/test-utils'
import Progress from '@/components/Progress.vue'

describe('RankingDialog', () => {
  test('renders correctly', () => {
    // Mount the component
    const wrapper = mount(Progress)

    // Assert that the component renders correctly
    expect(wrapper.exists()).toBe(true)
  })

  test('shows the correct ranking information', async () => {
    // Mount the component
    const wrapper = mount(Progress)

    // Simulate adding some scores to the store
    const store = wrapper.vm.$store
    store.commit('addScore', 10)
    store.commit('addScore', 20)
    store.commit('addScore', 30)
    await wrapper.vm.$nextTick()

    // Open the ranking dialog
    const showRankingButton = wrapper.find('.show-ranking-button')
    await showRankingButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Assert that the dialog is open and displays the correct ranking information
    const dialog = wrapper.find('.el-dialog')
    expect(dialog.exists()).toBe(true)
    expect(dialog.text()).toContain('1st (30)')
    expect(dialog.text()).toContain('2nd (20)')
    expect(dialog.text()).toContain('3rd (10)')
  })
})
