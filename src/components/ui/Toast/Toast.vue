<template>
  <div
    id="toast-messages"
    ref="clickableAreaRef"
    class="relative w-full m-0 p-0"
    @mouseleave="onInactivity()"
    @mouseover="onActivity()"
  >
    <Transition name="fade">
      <div
        v-if="visibleToastMessages.length > 0"
        data-test="messages-container"
        class="z-40 absolute w-full root"
        :class="{ 'root-unstacked': !isStacked }"
      >
        <TransitionGroup
          id="viewportRef"
          ref="viewportRef"
          name="list"
          tag="div"
          class="messages-viewport w-full"
          :class="{ 'messages-viewport-unstacked': !isStacked }"
        >
          <div
            key="aaa"
            :style="`height:${isStacked ? 'auto' : viewportHeight + 'px'};`"
            class="w-full absolute w-full"
          >
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
              <div :style="{ opacity: toastIndex === 0 || !isStacked ? 1 : 0 }" class="flex">
                <div class="theme-inverse text-text">{{ toastIndex }}-{{ message }}</div>
                <div class="flex inline-block align-middle">
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
          </div>
        </TransitionGroup>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-show="!isStacked && visibleToastMessages.length > 1" key="button-group" class="mt-1 absolute bottom-0">
        <button class="button-xs" @click="isStacked = true">Show less</button>
        <button class="button-xs ml-1" @click="clearAllNotifications()">Clear All</button>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { computed, onMounted, ref, toRef, watch, withDefaults } from 'vue';

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
const hoverTimeout = ref(null);
const viewportHeight = ref(0);
const stackingTimeout = ref(null);
const isHovering = ref(null);
const clickableAreaRef = ref(null);
const viewportRef = ref(null);
const toastMessages = ref(messages);
const notificationComputedStyles = ref([]);

const visibleToastMessages = computed(() => [...toastMessages.value]?.reverse() ?? []);

const totalStackedToasts = 3;

function toastComputedStyle(): void {
  // const dismissControlsHeight = visibleToastMessages.value.length > 1 ? 30 : 0;
  const dismissControlsHeight = 0;
  const toastSpacer = 5;
  visibleToastMessages.value.forEach((m, index) => {
    let style = '';
    let heightPreviousToasts = 0;
    for (let i = 0; i < index; i++) {
      const elHeight = document.getElementById(`toast-${i}`)?.offsetHeight;
      if (elHeight && index !== 0) heightPreviousToasts += elHeight + toastSpacer;
    }
    if (!isStacked.value) {
      style = `
        bottom: ${dismissControlsHeight + heightPreviousToasts}px;
        opacity: 1;
        position: absolute;
        width: 100%;
        z-index: ${visibleToastMessages.value.length - index};
      `;
    } else {
      const isVisible = index < totalStackedToasts;
      const toastHeight = index === 0 ? '' : `height:${document.getElementById(`toast-${0}`)?.offsetHeight}px;`;
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
    visibleToastMessages.value.forEach(
      (vt, i) => (totalHeight += document.getElementById(`toast-${i}`)?.offsetHeight + toastSpacer),
    );
    viewportHeight.value = totalHeight + dismissControlsHeight;
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
}

function onInactivity() {
  isHovering.value = false;
  clearTimeout(hoverTimeout.value);
  clearTimeout(stackingTimeout.value);

  // TODO: enable
  // hoverTimeout.value = setTimeout(() =>  {
  //   isStacked.value = true;
  // }, 4000)

  // hoverTimeout.value = setTimeout(() =>  {
  //   // clearAllNotifications()
  // }, 5000)
}

function showClearButton(index) {
  return isHovering.value && isStacked.value && index === 0;
}

function onActivity() {
  isHovering.value = true;
  clearTimeout(hoverTimeout.value);
  clearTimeout(stackingTimeout.value);
}

function updateToastPositions() {
  toastComputedStyle();
  document.getElementById('viewportRef').scrollTop = document.getElementById('viewportRef').scrollHeight;

  // Necessary to wait for elements to render correct height
  window.requestAnimationFrame(() => {
    toastComputedStyle();
    document.getElementById('viewportRef').scrollTop = document.getElementById('viewportRef').scrollHeight;
  });
  setTimeout(() => {
    toastComputedStyle();
    document.getElementById('viewportRef').scrollTop = document.getElementById('viewportRef').scrollHeight;
  }, 100);
  setTimeout(() => {
    toastComputedStyle();
    document.getElementById('viewportRef').scrollTop = document.getElementById('viewportRef').scrollHeight;
  }, 200);
  setTimeout(() => {
    toastComputedStyle();
    document.getElementById('viewportRef').scrollTop = document.getElementById('viewportRef').scrollHeight;
  }, 1000);
}

watch(
  () => [isStacked.value, visibleToastMessages.value],
  () => {
    updateToastPositions();
  },
);

onClickOutside(clickableAreaRef, () => {
  isStacked.value = true;
});

onMounted(() => {
  updateToastPositions();
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
.root {
  /* height: 150px; */
  /* transform: translateY(-150px); */
}
.root-unstacked {
  /* height: 300px; */
  transform: translateY(-300px);
}
.messages-viewport {
  /* height: 150px; */
  position: relative;
}
.messages-viewport-unstacked {
  height: 270px;
  overflow-y: scroll;
  position: relative;
}

/* TODO: use ui Button */
.dismiss-button {
  @apply py-1 px-2 text-inverse -text-1 font-medium rounded-full focus:outline-none;
  position: absolute;
  background-color: #555555;
  left: -0.75rem;
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
