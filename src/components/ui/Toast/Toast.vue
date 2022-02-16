<template>
  <div id="toast-messages" ref="clickableAreaRef" class="relative w-full m-0 p-0">
    <Transition name="fade">
      <div
        v-if="visibleToastMessages.length > 0"
        class="z-40 absolute w-full root"
        :class="{ 'root-unstacked': !isStacked }"
      >
        <div>
          <TransitionGroup
            name="list"
            tag="div"
            class="messages-viewport"
            :class="{ 'messages-viewport-unstacked': !isStacked }"
          >
            <div
              v-for="({ message, id }, toastIndex) in visibleToastMessages"
              :key="`message-${id}`"
              class="toast-message"
              :style="computedToastStyle(toastIndex)"
              @click="expandNotifications()"
            >
              <button class="dismiss-button" @click="dismissNotification(id)">X</button>
              <div class="theme-inverse text-text">{{ toastIndex }}-{{ id }}-{{ message }}</div>
              <div class="flex">
                <Button :name="'Details'" class="text-secondary" variant="link" @click="emit('details-function', id)" />
                <Button :name="'Undo'" class="text-secondary ml-2" variant="link" @click="emit('undo-function', id)" />
              </div>
            </div>
          </TransitionGroup>
          <Transition name="fade">
            <div
              v-show="!isStacked && visibleToastMessages.length > 1"
              key="button-group"
              class="mt-1 absolute bottom-0"
            >
              <button class="button-xs" @click="isStacked = true">Show less</button>
              <button class="button-xs ml-1" @click="clearAllNotifications()">Clear All</button>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { computed, defineProps, ref, toRefs, withDefaults } from 'vue';

import Button from '@/components/ui/Button.vue';

interface NotificationMessage {
  message: string;
  date: string;
  id: number | string;
}

interface Props {
  messages?: NotificationMessage[];
}
const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  // TODO: implement sorting props
  // sortByProperty
  // sortDirection
});
const { messages } = toRefs(props);

const emit = defineEmits<{
  (e: 'details-function', id: number | string);
  (e: 'undo-function', id: number | string);
}>();

const isStacked = ref(true);
const clickableAreaRef = ref(null);
const toastMessages = ref(messages.value);

const visibleToastMessages = computed(() => [...toastMessages.value].reverse());

function computedToastStyle(index: number): string {
  if (!isStacked.value) {
    return `
      position: absolute;
      width: 100%;
      opacity: 1;
      bottom: ${2 + 4.2 * index}rem;
      z-index: ${visibleToastMessages.value.length - index};
    `;
  }
  // const isVisible = index < totalStackedToasts
  return `
    position: absolute;
    z-index: ${visibleToastMessages.value.length - index};
    width: ${100 - index * 2}%;
    height: ${index > 0 ? '3rem' : 'auto'};
    bottom: ${0.5 * index}rem;
    opacity: ${1 - index * 0.1};
   `;
}

function clearAllNotifications() {
  toastMessages.value = [];
  isStacked.value = true;
}

function expandNotifications() {
  if (!isStacked.value) return;
  isStacked.value = false;
}

function dismissNotification(id) {
  toastMessages.value = toastMessages.value.filter((tm) => tm.id !== id);
}

onClickOutside(clickableAreaRef, () => (isStacked.value = true));
</script>

<style lang="postcss">
.toast-message {
  @apply flex absolute px-4 py-3 flex justify-between bg-black;
  border-radius: 0.5rem;
  transition: all 0.5s ease-out;
  width: 100%;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}
/* TODO: replace with regular ui button component */
.button-xs {
  @apply px-2 py-1 opacity-60 bg-black bg-opacity-10 text-inverse -text-1 font-medium rounded-full focus:outline-none;
}
.root {
  height: 150px;
  transform: translateY(-150px);
}
.root-unstacked {
  height: 300px;
  transform: translateY(-300px);
}
.messages-viewport {
  height: 150px;
  position: relative;
}
.messages-viewport-unstacked {
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* TODO: use ui Button */
.dismiss-button {
  @apply px-2 py-1 bg-black bg-opacity-10 text-inverse -text-1 font-medium rounded-full focus:outline-none;
}

/* transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
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
