<template>
  <div
    id="toast-messages"
    ref="clickableAreaRef"
    class="relative w-full m-0 p-0"
    @mouseleave="isMouseOverComponent = false"
    @mousemove="isMouseOverComponent = true"
  >
    <Transition name="fade" appear>
      <div
        v-if="visibleToastMessages.length > 0"
        data-test="messages-container"
        class="z-40 absolute w-full root"
        :class="{ 'root-unstacked': !isStacked, 'opacity-0': visibleToastMessages.length === 0 }"
      >
        <div
          id="viewportRef"
          ref="viewportRef"
          name="list"
          class="messages-viewport w-full flex flex-col-reverse"
          :class="{ 'messages-viewport-unstacked': !isStacked }"
        >
          <div :style="`height:${isStacked ? 'auto' : viewportHeight + 'px'};`" class="w-full absolute">
            <TransitionGroup name="list" tag="div" appear>
              <div
                v-for="({ message, id }, toastIndex) in visibleToastMessages"
                :id="`toast-${toastIndex}`"
                :key="`message-${id}`"
                class="toast-message"
                :style="notificationComputedStyles[toastIndex]"
                data-test="toast-message"
                @click="expandNotifications()"
              >
                <Transition name="fade-hover">
                  <button
                    v-if="showClearButton(toastIndex)"
                    class="dismiss-button"
                    data-test="dismiss-toast"
                    @click="clearAllNotifications()"
                  >
                    <Icon v-if="visibleToastMessages.length === 1" name="CloseIcon" :icon-size="0.563" />
                    <span v-else>Clear All</span>
                  </button>
                </Transition>
                <div :style="{ opacity: toastIndex === 0 || !isStacked ? 1 : 0 }" class="flex flex-grow">
                  <div class="flex-1 theme-inverse text-text">{{ message }}</div>
                  <div class="flex items-center">
                    <Button
                      :name="buttonLabel2"
                      class="text-quaternary ml-3"
                      variant="link"
                      @click="emit('onButton2Click', id)"
                    />
                    <Button
                      :name="buttonLabel1"
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
      <div v-show="!isStacked && visibleToastMessages.length > 1" key="button-group" class="mt-1 absolute bottom-0">
        <button class="button-xs" @click="isStacked = true">Show less</button>
        <button class="button-xs ml-1" @click="clearAllNotifications()">Clear All</button>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { computed, onMounted, onUnmounted, ref, toRef, watch, withDefaults } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

interface NotificationMessage {
  message: string;
  date: string;
  id: number | string;
}

interface Props {
  messages?: NotificationMessage[];
  buttonLabel1?: string;
  buttonLabel2?: string;
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  buttonLabel1: 'Undo',
  buttonLabel2: 'Details',
  // TODO: implement sorting props
  // sortByProperty
  // sortDirection
});

const messages = toRef(props, 'messages');

const emit = defineEmits<{
  (e: 'onButton2Click', id: number | string);
  (e: 'onButton1Click', id: number | string);
  (e: 'onUpdate', messages: NotificationMessage[]);
}>();

const isStacked = ref(true);
const viewportHeight = ref(0);
const isMouseOverComponent = ref(null);
const clickableAreaRef = ref(null);
const viewportRef = ref(null);
const toastMessages = ref(messages);
const notificationComputedStyles = ref([]);

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

function clearAllNotifications() {
  emit('onUpdate', []);
  isStacked.value = true;
}

function expandNotifications() {
  if (!isStacked.value || toastMessages.value.length === 1) return;

  isStacked.value = false;
}

function dismissNotification(id) {
  emit('onUpdate', [...toastMessages.value.filter((tm) => tm.id !== id)]);
  if (visibleToastMessages.value.length === 0) isStacked.value = false;
}

function onInactivityStart() {
  if (isMouseOverComponent.value) return;
  startDismissNotificationTimeout();
}

function startDismissNotificationTimeout() {
  clearTimeout(inactivityTimeout.value);
  inactivityTimeout.value = setTimeout(() => {
    const lastNotificationId = visibleToastMessages.value[visibleToastMessages.value.length - 1]?.id;
    if (lastNotificationId >= 0) {
      console.log('dismiss', lastNotificationId);
      dismissNotification(lastNotificationId);
    }
    if (visibleToastMessages.value.length > 0) onInactivityStart();
  }, 5000);
}

function showClearButton(index) {
  return isMouseOverComponent.value && isStacked.value && index === 0;
}

function onActivity() {
  clearTimeout(inactivityTimeout.value);
}

function scrollNotificationsViewportToBottom() {
  if (viewportRef.value) viewportRef.value.scrollTop = viewportRef.value.scrollHeight;
}

function updateNotificationPositions() {
  computeNotificationsStyle();
  scrollNotificationsViewportToBottom();

  // Necessary to wait for elements to render correct height as they repaint
  window.requestAnimationFrame(() => {
    computeNotificationsStyle();
    scrollNotificationsViewportToBottom();
  });
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
    onInactivityStart();
    updateNotificationPositions();
    if (visibleToastMessages.value.length === 1) {
      isStacked.value = true;
    }
  },
);

watch(
  () => isMouseOverComponent.value,
  () => {
    onActivity();
    onInactivityStart();
  },
);

onClickOutside(clickableAreaRef, () => {
  isStacked.value = true;
});

onMounted(() => {
  updateNotificationPositions();
  onInactivityStart();
});

onUnmounted(() => {
  clearTimeout(inactivityTimeout.value);
});
</script>

<style lang="postcss">
.toast-message {
  @apply flex absolute px-4 py-3 justify-between bg-black;
  border-radius: 0.5rem;
  transition: all 0.3s ease-out;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  margin-left: auto;
  margin-right: auto;
}
/* TODO: replace with regular ui button component */
.button-xs {
  @apply px-2 py-1 opacity-60 bg-black bg-opacity-10 text-inverse -text-1 font-medium rounded-full focus:outline-none;
}
.root-unstacked {
  transform: translateY(-300px);
}
.messages-viewport {
  position: relative;
}
.messages-viewport-unstacked {
  height: 270px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

/* TODO: use ui Button */
.dismiss-button {
  @apply py-1 px-2 text-inverse -text-1 font-medium rounded-full focus:outline-none;
  position: absolute;
  background-color: #555555;
  left: -0.75rem;
  min-height: 1.5rem;
  min-width: 1.5rem;
  top: -0.5rem;
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
