<template>
  <div id="home">
    <div id="home-content">
      <!-- Search -->
      <div id="home-logo" class="sticky">
        <img src="/img/logo.png" alt="" />
      </div>
      <!-- Category selection -->
      <div id="header-menu">
        <img id="micbg" src="/img/micbg.gif" alt="" />
        <div id="menu-description">
          Il traspositore automatico che permette<br />di variare
          istantaneamente gli accordi<br />e la tonalità di tutti i brani per
          cantare<br />e di salvare/stampare i testi modificati
        </div>
      </div>
      <div id="song-select">
        <transition
          enter-active-class="animate__animated animate__fadeInLeft"
          leave-active-class="animate__animated animate__fadeOutLeft"
        >
          <ul id="categories" v-if="!selected_category_id">
            <div class="top-menu">Scegli il brano all'interno dell'Unità:</div>
            <li
              class="category-container"
              v-for="(category, category_idx) in categories"
              :key="'category-' + category_idx"
              :class="{ selected: selected_category_id == category_idx }"
            >
              <span
                class="category"
                @click="toggle_category(category_idx)"
                v-if="category.subs"
                >{{ category.label }}
                <span
                  v-if="open_categories.indexOf(category_idx) == -1"
                  class="expand"
                  >+</span
                ><span v-else class="expand">-</span></span
              >
              <span
                class="category"
                @click="select_category(category_idx, category.label)"
                v-else
                >{{ category.label }}</span
              >
              <transition
                enter-active-class="animate__animated animate__flipInX"
                leave-active-class="animate__animated animate__flipOutX"
              >
                <ul
                  id="sub-category-container"
                  v-if="
                    category.subs && open_categories.indexOf(category_idx) != -1
                  "
                >
                  <li
                    class="sub-category"
                    v-for="(sub, sub_category_idx) in category.subs"
                    :key="'category-' + category_idx + '.' + sub_category_idx"
                    :class="{
                      selected:
                        selected_category_id ==
                        category_idx + '.' + sub_category_idx,
                    }"
                  >
                    <span
                      @click="
                        select_category(
                          category_idx + '.' + sub_category_idx,
                          category.label,
                        )
                      "
                      class="song_category"
                      >{{ sub.label }}</span
                    >
                  </li>
                </ul>
              </transition>
            </li>
          </ul>
        </transition>
        <!-- Songlist Select -->
        <transition
          enter-active-class="animate__animated animate__fadeInRight"
          leave-active-class="animate__animated animate__fadeOutRight"
        >
          <div id="sub-categories" v-if="selected_category_id">
            <a class="back" @click.prevent="back">&lt; Torna indietro</a>
            <div id="selected-category">
              {{ selected_category_label }}
            </div>
            <ul id="song-list">
              <div class="top-menu">Scegli la canzone:</div>
              <li
                v-for="song in category_songs"
                :key="'song-' + song.slug"
                class="song-option"
              >
                <a :href="`/canzone/${song.slug}`">
                  <span class="title">{{ song.artist }}</span> -
                  <span class="artist">{{ song.title }}</span>
                </a>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import categories from "../../data/categories.json";
import song_list from "../../data/songs/index.json";

export default {
  name: "song-list",
  data() {
    return {
      categories: [],
      selected_category_label: "",
      selected_category_id: "",
      category_songs: [],
      open_categories: [],
    };
  },
  mounted() {
    this.categories = categories;
  },
  methods: {
    select_category(selected, label) {
      this.selected_category_id = selected;
      this.selected_category_label = label;
      let [category, sub_category] = this.selected_category_id.split(".");
      this.category_songs = sub_category
        ? song_list[category][sub_category]
        : song_list[category];
    },
    back() {
      this.selected_category_id = "";
      this.selected_category_label = "";
    },
    toggle_category(selected) {
      let pos = this.open_categories.indexOf(selected);
      if (pos != -1) {
        this.open_categories.splice(pos, 1);
      } else {
        this.open_categories.push(selected);
      }
    },
  },
};
</script>

<style lang="scss">
body {
  background: linear-gradient(135deg, #228eb0, #d7004f 70.71%);
}
#home {
  background: linear-gradient(45deg, #228eb0, #d7004f 70.71%);
  display: flex;
  height: 100vh;
}

#home-content {
  width: 100%;
  max-width: 800px;
  height: 522px;
  margin: 120px auto;
  background: #fff;
  border: 12px solid #fff;
}

#home-logo {
  margin-top: -75px;
  z-index: 999999;
  position: relative;
}

#home-logo img {
  margin: auto;
  width: 100%;
  max-width: 360px;
}

#micbg {
  width: 100%;
  max-width: 776px;
  margin-top: -39px;
  z-index: 1;
}

#song-select {
  font-size: 20px;
  display: flex;
  justify-content: center;
  & > * {
    position: absolute;
  }
  ul {
    list-style: none;
    text-align: left;
    li {
      cursor: pointer;
      line-height: 32px;
    }
  }
}

#menu-description {
  margin: 32px auto 0;
  padding: 0 80px;
  color: #000;
  font-weight: bold;
  font-size: 32px;
  line-height: 36px;
}

#menu-index {
  width: 460px;
  margin: 12px auto 0 auto;
  text-align: left;
  font-size: 0.8em;
}

#categories {
  width: 800px;
  margin: 29px 0 48px 0;
  padding: 24px 168px 64px;
  background: #fff;
  color: #ed2869;
}

.top-menu {
  font-size: 16px;
  color: #999;
  margin-bottom: 16px;
}

.category-container {
  font-weight: 700;
  text-transform: uppercase;
}

.category {
  padding-left: 4px;
  display: block;
  height: 32px;
  position: relative;
  &:hover {
    color: #fff;
    background: #ed2869;
  }
}

#selected-category {
  padding: 2px 16px 0;
  line-height: 36px;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
  background-color: #ed2869;
}

.back {
  display: block;
  margin: 0 0 4px 0;
  text-align: left;
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  color: #00b7c9;
  font-weight: 700;
}

.expand {
  display: inline-block;
  width: 16px;
  color: #999;
}

#sub-categories {
  width: 800px;
  margin: 29px 0 48px 0;
  padding: 24px 168px 64px;
  background: #fff;
}

#sub-category-container {
  background: transparent;
}

.sub-category {
  padding-left: 12px;
  font-weight: normal;
  position: relative;
  &:hover {
    color: #fff;
    background: #ed2869;
  }
}

#song-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  font-size: 0.9em;
  line-height: 0.9em;
  padding: 16px 0 0 16px;
  .song-option {
    color: #222;
    font-size: 0.9em;
    cursor: pointer;
    user-select: none;
    transition: 0.2s;
    padding: 0 6px;
    &:hover {
      color: #fff;
      background-color: #00b7c9;
    }
    a {
      text-decoration: none;
      color: inherit;
    }
    .title {
      font-weight: 700;
    }
  }
}
.song_category:hover {
  background: transparent;
}
</style>
