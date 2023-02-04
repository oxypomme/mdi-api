<script setup>
</script>

<template>
  <v-app theme="dark">
    <v-container style="max-width: 900px">
      <v-card>
        <v-form>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-form class="search-form mb-4" @submit="onSearch">
                    <v-text-field v-model="search" label="Nom de l'icone" required variant="underlined" hide-details>
                    </v-text-field>
                    <v-btn type="submit" class="ml-2" color="primary" :disabled="isLoading">
                      <v-icon icon="mdi-magnify"> </v-icon>
                    </v-btn>
                  </v-form>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-alert type="success" :style="{ opacity: currentOpacity, transition: 'opacity 0.25s' }">
                    {{ current }} is now in your clipboard !
                  </v-alert>
                </v-col>
                <v-col cols="3" class="ml-auto">
                  <v-text-field v-model="prefix" label="Prefixe" variant="underlined" hide-details>
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-tabs v-model="type" @update:modelValue="onTabChange">
                    <v-tab v-for="name in types" :key="name">{{ name }}</v-tab>
                  </v-tabs>
                </v-col>
              </v-row>

              <v-row v-if="!isLoading">
                <v-col>
                  <v-tooltip v-for="icon in icons" :key="icon" top :text="icon" location="top">
                    <template #activator="{ props }">
                      <v-btn icon @click="onIconClick(icon)" class="mr-1 mb-1" v-bind="props">
                        <v-icon> mdi-{{ icon }} </v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <v-btn v-for="i in API_LIMIT" :key="i" text icon class="mr-1 mb-1" disabled>
                    <v-icon icon="mdi-dots-circle"></v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-pagination v-model="page" circle :disabled="isLoading" :length="maxPage"
                  total-visible="5"></v-pagination>
              </v-row>
            </v-container>

          </v-card-text>
        </v-form>

        <v-toolbar title="MDI API Explorer" density="compact">
          <span>All rights to <a href="https://materialdesignicons.com/">Material Design Icons</a></span>

          <v-tooltip top text="GitHub project" location="top">
            <template #activator="{ props }">
              <v-btn class="ml-2" icon href="https://github.com/oxypomme/mdi-api" v-bind="props">
                <v-icon icon="mdi-github"> </v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip top text="Documentation - Coming soon" location="top">
            <template #activator="{ props }">
              <v-btn class="ml-1" icon to="/docs" v-bind="props">
                <v-icon icon="mdi-file-document"> </v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-toolbar>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const API_LIMIT = 33 * 2

const isLoading = ref(false);
const icons = ref([])
const maxPage = ref(0);
const page = ref(1);
const type = ref(0);
const types = ref(['filled', 'outline']);
const search = ref('');
const prefix = ref('mdi')
const current = ref('');
const currentOpacity = ref(0);

watch(page, () => getIcons());

/**
 * Handler when an icon is choosen
 *
 * @param icon The icon name
 */
const onIconClick = (icon) => {
  const p = prefix.value;

  const clip = `${p ? p + '-' : ''}${icon}`;
  navigator.clipboard.writeText(clip);
  current.value = clip;

  currentOpacity.value = 1;
  setTimeout(() => {
    currentOpacity.value = 0;
  }, 2000);
};

/**
 * Handler when search form is submitted
 *
 * @param e The event
 */
const onSearch = (e) => {
  e.preventDefault()
  e.stopPropagation()

  if(page.value !== 1) {
    page.value = 1
  } else {
    getIcons()
  }
};

/**
 * Handler when a tab is changed
 */
const onTabChange = () => {
  if(page.value !== 1) {
    page.value = 1
  } else {
    getIcons()
  }
};

/**
 * Get icons from MDI
 */
const getIcons = async () => {
  if (!isLoading.value) {
    isLoading.value = true
    const offset = API_LIMIT * (page.value - 1)
    try {
      const { data, total } = await (
        await fetch(
          '/icons/?' +
            new URLSearchParams({
              limit: API_LIMIT.toString(),
              search: search.value,
              type: types.value[type.value],
              offset: offset.toString(),
            })
        )
      ).json()
      icons.value = data.map(({ name }) => name)
      maxPage.value = Math.ceil(total / API_LIMIT)
    } catch (error) {
      // TODO
    }
    isLoading.value = false
  }
}

onMounted(() => {
  // Fetch firsts icons
  getIcons()
})
</script>

<style scoped>
.search-form {
  display: flex;
  align-items: center;
  width: 100%;
}
</style>
