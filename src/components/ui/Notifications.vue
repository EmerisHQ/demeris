<template>
  <div
    ref="clickableAreaRef"
    class="relative w-full m-0 p-0"
    @mouseleave="isMouseOverComponent = false"
    @mousemove="isMouseOverComponent = true"
  >
    <Transition name="fade" appear>
      <div
        v-if="visibleToastMessages.length > 0"
        data-test="messages-container"
        class="z-40 absolute w-full root theme-inverse dark:theme-inverse"
        :class="{ 'root-unstacked': !isStacked, 'opacity-0': visibleToastMessages.length === 0 }"
      >
        <div
          id="viewportRef"
          ref="viewportRef"
          name="list"
          class="w-full relative flex flex-col-reverse"
          :class="{ 'messages-viewport-unstacked': !isStacked }"
        >
          <div :style="`height:${isStacked ? 'auto' : viewportHeight + 'px'};`" class="w-full absolute">
            <TransitionGroup name="list" tag="div" appear>
              <div
                v-for="({ message, id }, toastIndex) in visibleToastMessages"
                :id="`toast-${toastIndex}`"
                :key="`message-${id}`"
                class="toast-message w-full flex absolute px-4 py-3 justify-between bg-surface rounded-lg left-0 bottom-0 right-0 mx-auto"
                :style="notificationComputedStyles[toastIndex]"
                data-test="toast-message"
                @click="expandNotifications()"
              >
                <Transition name="fade-hover">
                  <button
                    v-if="showClearButton(toastIndex)"
                    class="clear-all-button absolute bg-surface py-1 px-2 text-text -text-1 font-medium rounded-full focus:outline-none;"
                    data-test="clear-all-notifications-button"
                    @click="clearAllNotifications()"
                    @mouseover="isHoverClearAllButton = true"
                    @mouseleave="isHoverClearAllButton = false"
                  >
                    <Icon
                      v-if="visibleToastMessages.length === 1 || !isHoverClearAllButton"
                      key="icon"
                      name="CloseIcon"
                      :icon-size="0.563"
                    />
                    <span
                      v-if="visibleToastMessages.length > 1 && isHoverClearAllButton"
                      key="text"
                      class="text-text"
                    >{{ clearAllLabel }}</span>
                  </button>
                </Transition>
                <div :style="{ opacity: toastIndex === 0 || !isStacked ? 1 : 0 }" class="flex flex-grow">
                  <div class="flex-1 text-text">{{ message }}</div>
                  <div v-if="button1Label || button2Label" class="flex items-center">
                    <Button
                      v-if="button2Label"
                      :name="button2Label"
                      class="text-quaternary ml-3"
                      variant="link"
                      @click="emit('onButton2Click', id)"
                    />
                    <Button
                      v-if="button1Label"
                      :name="button1Label"
                      class="text-quaternary ml-3"
                      variant="link"
                      @click="emit('onButton1Click', id)"
                    />
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="fade-controls">
      <div
        v-show="!isStacked && visibleToastMessages.length > 1"
        key="button-group"
        class="mt-1 absolute bottom-0 text-text theme-inverse dark:theme-inverse"
      >
        <button
          class="px-2 py-1 opacity-60 bg-surface -text-1 text-text font-medium rounded-full focus:outline-none"
          @click="isStacked = true"
        >
          {{ showLessLabel }}
        </button>
        <button
          class="px-2 py-1 opacity-60 bg-surface -text-1 text-text font-medium rounded-full focus:outline-none ml-1"
          @click="clearAllNotifications()"
        >
          {{ clearAllLabel }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { computed, onMounted, onUnmounted, ref, toRefs, watch, withDefaults } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

interface NotificationMessage {
  message: string;
  id: number | string;
}

interface Props {
  button1Label?: string;
  button2Label?: string;
  clearAllLabel: string;
  dismissInterval?: number;
  messages?: NotificationMessage[];
  showLessLabel: string;
}

const props = withDefaults(defineProps<Props>(), {
  button1Label: '',
  button2Label: '',
  clearAllLabel: '',
  dismissInterval: 5000,
  messages: () => [],
  showLessLabel: '',
});

const { button1Label, button2Label, clearAllLabel, messages, showLessLabel, dismissInterval } = toRefs(props);

const emit = defineEmits<{
  (e: 'onButton2Click', id: number | string);
  (e: 'onButton1Click', id: number | string);
  (e: 'onUpdate', messages: NotificationMessage[]);
}>();

const isStacked = ref<boolean>(true);
const viewportHeight = ref(0);
const isMouseOverComponent = ref<boolean>(false);
const isHoverClearAllButton = ref<boolean>(false);
const clickableAreaRef = ref(null);
const viewportRef = ref(null);
const toastMessages = ref<NotificationMessage[]>(messages);
const notificationComputedStyles = ref<string[]>([]);
const inactivityTimeout = ref(null);
const visibleToastMessages = computed(() => [...toastMessages.value]?.reverse() ?? []);
const totalStackedToasts = 3;

function computeNotificationsStyle(): void {
  if (visibleToastMessages.value.length === 0) return;

  const notificationSpacerPx = 5;
  visibleToastMessages.value.forEach((m, index) => {
    let style = '';
    let heightPreviousToasts = 0;
    for (let i = 0; i < index; i++) {
      const elHeight = document.getElementById(`toast-${i}`)?.offsetHeight || 0;
      if (elHeight && index !== 0) heightPreviousToasts += elHeight + notificationSpacerPx;
    }
    if (!isStacked.value) {
      style = `
        bottom: ${heightPreviousToasts}px;
        opacity: 1;
        position: absolute;
        width: 100%;
        z-index: ${visibleToastMessages.value.length - index};
      `;
    } else {
      const isVisible = index < totalStackedToasts;
      const firstToastHeight = document.getElementById('toast-0')?.offsetHeight || 0;
      const toastHeight = index === 0 ? '' : `height:${firstToastHeight}px;`;
      style = `
        bottom: ${index === 0 ? 0 : 8 * index}px;
        ${toastHeight}
        opacity: ${isVisible ? 1 - index * 0.1 : 0};
        position: absolute;
        width: ${100 - index * 4}%;
        z-index: ${visibleToastMessages.value.length - index};
      `;
    }
    let totalHeight = 0;
    visibleToastMessages.value.forEach((vt, i) => {
      const toastHeight = document.getElementById(`toast-${i}`)?.offsetHeight || 0;
      if (toastHeight) totalHeight += toastHeight + notificationSpacerPx;
    });
    viewportHeight.value = totalHeight;
    notificationComputedStyles.value[index] = style;
  });
}

function clearAllNotifications(): void {
  emit('onUpdate', []);
  isStacked.value = true;
}

function expandNotifications(): void {
  if (!isStacked.value || toastMessages.value.length === 1) return;

  isStacked.value = false;
}

function dismissNotification(id): void {
  emit('onUpdate', [...toastMessages.value.filter((tm) => tm.id !== id)]);
  if (visibleToastMessages.value.length === 0) isStacked.value = false;
}

function startInactivityTimer(): void {
  if (isMouseOverComponent.value) return;
  startDismissNotificationTimeout();
}

function startDismissNotificationTimeout(): void {
  clearTimeout(inactivityTimeout.value);
  inactivityTimeout.value = setTimeout(() => {
    const lastNotificationId = visibleToastMessages.value[visibleToastMessages.value.length - 1]?.id;
    if (lastNotificationId >= 0) dismissNotification(lastNotificationId);
    if (visibleToastMessages.value.length > 0) startInactivityTimer();
  }, dismissInterval.value);
}

function showClearButton(index): boolean {
  return isMouseOverComponent.value && isStacked.value && index === 0;
}

function scrollNotificationsViewportToBottom(): void {
  if (viewportRef.value) viewportRef.value.scrollTop = viewportRef.value.scrollHeight;
}

function updateNotificationPositions(): void {
  computeNotificationsStyle();
  scrollNotificationsViewportToBottom();

  // Necessary to wait for elements to render correct height as they repaint
  window.requestAnimationFrame(() => {
    computeNotificationsStyle();
    scrollNotificationsViewportToBottom();
  });

  // TODO: improve this - elements change size over time
  // and requires re-calculation in first few seconds
  setTimeout(() => {
    computeNotificationsStyle();
    scrollNotificationsViewportToBottom();
  }, 100);
  setTimeout(() => {
    computeNotificationsStyle();
    scrollNotificationsViewportToBottom();
  }, 200);
  setTimeout(() => {
    computeNotificationsStyle();
    scrollNotificationsViewportToBottom();
  }, 1000);
}

watch(
  () => [isStacked.value, visibleToastMessages.value],
  () => {
    startInactivityTimer();
    updateNotificationPositions();
    if (visibleToastMessages.value.length === 1) {
      isStacked.value = true;
    }
  },
);

watch(
  () => isMouseOverComponent.value,
  () => {
    clearTimeout(inactivityTimeout.value);
    startInactivityTimer();
  },
);

onClickOutside(clickableAreaRef, () => {
  isStacked.value = true;
});

onMounted(() => {
  updateNotificationPositions();
  startInactivityTimer();
});

onUnmounted(() => {
  clearTimeout(inactivityTimeout.value);
});
</script>

<style lang="postcss">
.toast-message {
  transition: all 0.3s ease-out;
}
.root-unstacked {
  transform: translateY(-300px);
}
.messages-viewport-unstacked {
  height: 270px;
  overflow-y: auto;
  overflow-x: hidden;
}
/* TODO: use ui Button */
.clear-all-button {
  background-color: #555555;
  left: -0.75rem;
  min-height: 1.5rem;
  min-width: 1.5rem;
  top: -0.8rem;
  z-index: 40;
}

/* transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-controls-enter-active,
.fade-controls-leave-active {
  transition: opacity 0.5s ease-out;
  transition: transform 0.5s ease-in-out;
}
.fade-controls-enter,
.fade-controls-leave-to {
  opacity: 0;
  transform: translateY(30px);
  height: 0;
}

.fade-hover-enter-active,
.fade-hover-leave-active {
  transition: opacity 0.5s ease-out;
  opacity: 1;
}
.fade-hover-enter,
.fade-hover-leave-to {
  opacity: 0;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0 !important;
  transform: translateX(30px);
}
</style>
