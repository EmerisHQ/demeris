<template>
  <div
    ref="clickableAreaRef"
    class="relative w-full m-0 p-0"
    @mouseleave="isMouseOverComponent = false"
    @mouseover="isMouseOverComponent = true"
  >
    <Transition name="fade" appear>
      <div
        v-if="visibleNotificationMessages.length > 0"
        data-test="messages-container"
        class="z-40 absolute w-full theme-inverse dark:theme-inverse"
        :class="{ unstacked: !isStacked, 'opacity-0': visibleNotificationMessages.length === 0 }"
      >
        <div
          ref="viewportRef"
          name="list"
          class="w-full relative flex flex-col-reverse"
          :class="{ 'messages-viewport-unstacked overflow-y-auto overflow-x-hidden': !isStacked }"
        >
          <div :style="`height:${isStacked ? 'auto' : notificationViewportHeight + 'px'};`" class="w-full absolute">
            <TransitionGroup name="notification-list" tag="div" appear>
              <div
                v-for="({ message, id }, displayIndex) in visibleNotificationMessages"
                :ref="
                  (el:HTMLDivElement) => {
                    notificationHTMLRefs[displayIndex] = el;
                  }
                "
                :key="`message-${id}`"
                class="notification w-full flex absolute px-4 py-3 justify-between bg-surface rounded-lg left-0 bottom-0 right-0 mx-auto"
                :style="notificationComputedStyles[displayIndex]"
                data-test="single-notification-message"
                @click="expandNotifications()"
              >
                <Transition name="fade" appear>
                  <button
                    v-if="showClearButton(displayIndex)"
                    class="clear-all-button absolute z-40 bg-surface py-1 px-2 text-text -text-1 font-medium rounded-full focus:outline-none;"
                    :data-test="`clear-all-notifications-button-${displayIndex}`"
                    @click="clearAllNotifications()"
                    @mouseover="isHoverClearAllButton = true"
                    @mouseleave="isHoverClearAllButton = false"
                  >
                    <Icon
                      v-if="visibleNotificationMessages.length === 1 || !isHoverClearAllButton"
                      key="icon"
                      name="CloseIcon"
                      :icon-size="0.563"
                    />
                    <span
                      v-if="visibleNotificationMessages.length > 1 && isHoverClearAllButton"
                      key="text"
                      class="text-text"
                    >{{ clearAllLabel }}</span>
                  </button>
                </Transition>
                <div
                  :style="{ opacity: displayIndex === 0 || !isStacked ? 1 : 0 }"
                  class="flex flex-grow"
                  :data-test="`notification-${displayIndex}`"
                >
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
    <Transition name="fade" appear>
      <div
        v-if="!isStacked && visibleNotificationMessages.length > 1"
        key="button-group"
        class="mt-1 absolute bottom-0 text-text theme-inverse dark:theme-inverse"
      >
        <button
          data-test="show-less-notifications-footer"
          class="px-2 py-1 opacity-60 bg-surface -text-1 text-text font-medium rounded-full focus:outline-none"
          @click="isStacked = true"
        >
          {{ showLessLabel }}
        </button>
        <button
          data-test="clear-all-notifications-footer"
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
import { onClickOutside, useDebounceFn, useDocumentVisibility, useElementVisibility } from '@vueuse/core';
import { computed, onMounted, onUnmounted, ref, toRefs, watch, withDefaults } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

interface NotificationMessage {
  message: string;
  id: number | string;
}

interface Props {
  autoDismiss?: boolean;
  button1Label?: string;
  button2Label?: string;
  clearAllLabel: string;
  dismissInterval?: number;
  messages?: NotificationMessage[];
  showLessLabel: string;
}

const props = withDefaults(defineProps<Props>(), {
  autoDismiss: true,
  button1Label: '',
  button2Label: '',
  clearAllLabel: '',
  dismissInterval: 5000,
  messages: () => [],
  showLessLabel: '',
});

const {
  autoDismiss,
  button1Label,
  button2Label,
  clearAllLabel,
  messages: notificationMessages,
  showLessLabel,
  dismissInterval,
} = toRefs(props);

const emit = defineEmits<{
  (e: 'onButton2Click', id: number | string);
  (e: 'onButton1Click', id: number | string);
  (e: 'onUpdate', messages: NotificationMessage[]);
}>();

const isStacked = ref<boolean>(true);
const isMouseOverComponent = ref<boolean>(false);
const isHoverClearAllButton = ref<boolean>(false);
const notificationViewportHeight = ref<number>(0);
const clickableAreaRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const notificationHTMLRefs = ref<HTMLDivElement[]>([]);
const notificationComputedStyles = ref<string[]>([]);
const inactivityTimeoutId = ref(null);
const styleCalculationTimeoutId = ref(null);

const visibleNotificationMessages = computed(() => [...notificationMessages.value]?.reverse() ?? []);

const totalStackedNotifications = 3;
const isDocumentVisible = useDocumentVisibility();
const isComponentVisible = useElementVisibility(clickableAreaRef);

function computeNotificationsStyles(): void {
  // styles are computed on demand to update dom
  if (visibleNotificationMessages.value.length === 0) return;
  const notificationSpacerPx = 5;
  visibleNotificationMessages.value.forEach((_, index) => {
    const heightPreviousNotifications = [...Array(index)].reduce(
      (totalHeight, _, i) => totalHeight + notificationHTMLRefs.value[i]?.offsetHeight + notificationSpacerPx,
      0,
    );
    let style = '';
    if (!isStacked.value) {
      style = `
        bottom: ${heightPreviousNotifications}px;
        opacity: 1;
        width: 100%;
        z-index: ${visibleNotificationMessages.value.length - index};
      `;
    } else {
      const isVisible = index < totalStackedNotifications;
      const firstToastHeight = notificationHTMLRefs.value[0]?.offsetHeight;
      const toastHeight = index === 0 ? '' : `height:${firstToastHeight}px;`;
      style = `
        bottom: ${index === 0 ? 0 : 8 * index}px;
        ${toastHeight}
        opacity: ${isVisible ? 1 - index * 0.1 : 0};
        width: ${100 - index * 4}%;
        z-index: ${visibleNotificationMessages.value.length - index};
      `;
    }
    notificationComputedStyles.value[index] = style;
    notificationViewportHeight.value = visibleNotificationMessages.value.reduce(
      (calculatedViewportHeight, _, i) =>
        calculatedViewportHeight + notificationHTMLRefs.value[i]?.offsetHeight + notificationSpacerPx,
      0,
    );
  });
}

function clearAllNotifications(): void {
  emit('onUpdate', []);
  isStacked.value = true;
}

function expandNotifications(): void {
  if (!isStacked.value || notificationMessages.value.length === 1) return;
  isStacked.value = false;
}

function dismissNotification(id: number | string): void {
  emit('onUpdate', [...notificationMessages.value.filter((tm) => tm.id !== id)]);
  if (visibleNotificationMessages.value.length === 0) isStacked.value = false;
}

function startInactivityTimer(): void {
  if (
    isMouseOverComponent.value ||
    !isComponentVisible.value ||
    isDocumentVisible.value === 'hidden' ||
    !autoDismiss.value
  ) {
    return;
  }
  startDismissNotificationTimeout();
}

function startDismissNotificationTimeout(): void {
  clearTimeout(inactivityTimeoutId.value);
  inactivityTimeoutId.value = setTimeout(() => {
    if (isMouseOverComponent.value || !isComponentVisible.value || isDocumentVisible.value === 'hidden') {
      return;
    }
    const lastNotificationId = visibleNotificationMessages.value[visibleNotificationMessages.value.length - 1]?.id;
    if (lastNotificationId >= 0) dismissNotification(lastNotificationId);
    if (visibleNotificationMessages.value.length > 0) startInactivityTimer();
  }, dismissInterval.value);
}

function showClearButton(index): boolean {
  return isMouseOverComponent.value && isStacked.value && index === 0;
}

function scrollNotificationsViewportToBottom(): void {
  if (viewportRef.value) viewportRef.value.scrollTop = viewportRef.value.scrollHeight;
}

function updateNotificationPositions(): void {
  computeNotificationsStyles();
  scrollNotificationsViewportToBottom();
  clearTimeout(styleCalculationTimeoutId.value);
  styleCalculationTimeoutId.value = setTimeout(() => {
    window.requestAnimationFrame(() => {
      computeNotificationsStyles();
      scrollNotificationsViewportToBottom();
    });
  }, 100);
}

function observeNotificationsDimensionChange() {
  const resizeObserver = new ResizeObserver((e) => {
    if (e)
      useDebounceFn(() => {
        updateNotificationPositions();
      }, 1000);
  });
  notificationHTMLRefs.value.forEach((e) => {
    if (e) {
      resizeObserver.unobserve(e);
      resizeObserver.observe(e);
    }
  });
}

watch(
  () => [isStacked.value, visibleNotificationMessages.value],
  () => {
    startInactivityTimer();
    updateNotificationPositions();
    observeNotificationsDimensionChange();
    if (visibleNotificationMessages.value.length === 1) isStacked.value = true;
  },
);

watch(
  () => isDocumentVisible.value,
  (isVisible) => {
    if (isVisible === 'visible') startInactivityTimer();
  },
);

watch(
  () => isMouseOverComponent.value,
  () => {
    if (!isMouseOverComponent.value) startInactivityTimer();
  },
);

onClickOutside(clickableAreaRef, () => {
  isStacked.value = true;
});

onMounted(() => {
  startInactivityTimer();
});

onUnmounted(() => {
  clearTimeout(inactivityTimeoutId.value);
});
</script>

<style lang="postcss">
.notification {
  transition: all 0.3s ease-out;
}
.unstacked {
  transform: translateY(-300px);
}
.messages-viewport-unstacked {
  height: 270px;
}
.clear-all-button {
  background-color: #555555;
  left: -0.75rem;
  min-height: 1.5rem;
  min-width: 1.5rem;
  top: -0.8rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.5s ease;
}
.notification-list-enter-from,
.notification-list-leave-to {
  opacity: 0 !important;
  transform: translateX(30px);
}
</style>
