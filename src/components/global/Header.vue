<template>
  <!--  <header id="_header-1-6"
            class="oxy-header-wrapper oxy-sticky-header oxy-overlay-header oxy-header box-shadow oxy-sticky-header-active oxy-sticky-header-fade-in">
      <div id="_header_row-2-6" class="oxy-header-row" data-target="desktop" v-if="!isMobile">
        <div class="oxy-header-container">
          <div id="_header_left-3-6" class="oxy-header-left">
            <div id="div_block-23-6" class="ct-div-block box-shadow">
              <a id="link-40-6" class="ct-link" :href="`${mainSiteBase}/#accueil`" target="_self">
                <img id="image-22-6" alt=""
                     src="https://legrandfourire.wpengine.com/wp-content/uploads/2021/04/Logo-Fondation-Quebecoise-Cancer.svg"
                     class="ct-image"/>
              </a>
            </div>
          </div>
          <div id="_header_center-4-6" class="oxy-header-center">
            <div id="-pro-menu-8-6" class="oxy-pro-menu">
              <div class="oxy-pro-menu-mobile-open-icon " data-off-canvas-alignment="">
                <svg id="-pro-menu-8-6-open-icon">
                  <use xlink:href="#FontAwesomeicon-bars"></use>
                </svg>
              </div>
              <div
                  class="oxy-pro-menu-container oxy-pro-menu-dropdown-links-visible-on-mobile oxy-pro-menu-dropdown-links-toggle oxy-pro-menu-show-dropdown"
                  data-aos-duration="400"
                  data-oxy-pro-menu-dropdown-animation="fade-up"
                  data-oxy-pro-menu-dropdown-animation-duration="0.4"
                  data-entire-parent-toggles-dropdown="true"
                  data-oxy-pro-menu-dropdown-links-on-mobile="toggle">
                <div class="menu-menu-principal-container">
                  <ul id="menu-menu-principal" class="oxy-pro-menu-list">
                    <li id="menu-item-35" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-35"><a
                        :href="`${mainSiteBase}#accueil`" data-ps2id-api="true">Accueil</a></li>
                    <li id="menu-item-19" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-19"><a
                        :href="`${mainSiteBase}#invitation`" data-ps2id-api="true">Votre invitation</a></li>
                    <li id="menu-item-20" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-20"><a
                        :href="`${mainSiteBase}#hotes`" data-ps2id-api="true">Vos hôtes</a></li>
                    <li id="menu-item-21" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-21"><a
                        :href="`${mainSiteBase}#echauffements`" data-ps2id-api="true">Vos échauffements</a></li>
                    <li id="menu-item-22" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-22"><a
                        :href="`${mainSiteBase}#legrandfourire`" data-ps2id-api="true">#LeGrandFouRIRE</a></li>
                    <li id="menu-item-23" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-23"><a
                        :href="`${mainSiteBase}#cause`" data-ps2id-api="true">La cause</a></li>
                  </ul>
                </div>
                <div class="oxy-pro-menu-mobile-close-icon">
                  <svg id="svg&#45;&#45;pro-menu-8-6">
                    <use xlink:href="#FontAwesomeicon-close"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div id="_header_right-5-6" class="oxy-header-right"></div>
        </div>
      </div>
      <div id="_header_row-18-6" class="oxy-header-row" data-target="mobile" v-else>
        <div class="oxy-header-container">
          <div id="_header_left-19-6" class="oxy-header-left">
            <div id="div_block-41-6" class="ct-div-block box-shadow">
              <a id="link-42-6" class="ct-link" :href="`${mainSiteBase}/#accueil`" target="_self">
                <img id="image-43-6" alt=""
                     src="https://legrandfourire.wpengine.com/wp-content/uploads/2021/04/Logo-Fondation-Quebecoise-Cancer.svg"
                     class="ct-image"/>
              </a>
            </div>
          </div>
          <div id="_header_center-20-6" class="oxy-header-center"></div>
          <div id="_header_right-21-6" class="oxy-header-right">
            <div id="-pro-menu-15-6" class="oxy-pro-menu " ref="oxyProMenu" :class="oxyProMenuClass">
              <div class="oxy-pro-menu-mobile-open-icon " @click="openMobileMenu" data-off-canvas-alignment="">
                <svg id="-pro-menu-15-6-open-icon">
                  <use xlink:href="#FontAwesomeicon-bars"></use>
                </svg>
              </div>
              <div
                  :class="oxyProMenuContainerClass" ref="oxyProMenuContainer"
                  class="oxy-pro-menu-container  oxy-pro-menu-dropdown-links-visible-on-mobile oxy-pro-menu-dropdown-links-toggle oxy-pro-menu-show-dropdown"
                  data-aos-duration="400"
                  data-oxy-pro-menu-dropdown-animation="fade-up"
                  data-oxy-pro-menu-dropdown-animation-duration="0.4"
                  data-entire-parent-toggles-dropdown="true"
                  data-oxy-pro-menu-dropdown-links-on-mobile="toggle">
                <div class="menu-menu-principal-container">
                  <ul id="menu-menu-principal-1" class="oxy-pro-menu-list" ref="oxyProMenuList">
                    <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-35">
                      <a :href="`${mainSiteBase}#accueil`" data-ps2id-api="true">Accueil</a>
                    </li>
                    <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-19">
                      <a :href="`${mainSiteBase}#invitation`" data-ps2id-api="true">Votre invitation</a>
                    </li>
                    <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-20">
                      <a :href="`${mainSiteBase}#hotes`" data-ps2id-api="true">Vos hôtes</a>
                    </li>
                    <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-21">
                      <a :href="`${mainSiteBase}#echauffements`" data-ps2id-api="true">Vos échauffements</a>
                    </li>
                    <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-22">
                      <a :href="`${mainSiteBase}#legrandfourire`" data-ps2id-api="true">#LeGrandFouRIRE</a>
                    </li>
                    <li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-23">
                      <a :href="`${mainSiteBase}#cause`" data-ps2id-api="true">La cause</a></li>
                  </ul>
                </div>
                <div class="oxy-pro-menu-mobile-close-icon" @click="closeMobileMenu">
                  <svg id="svg&#45;&#45;pro-menu-15-6">
                    <use xlink:href="#FontAwesomeicon-close"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>-->
  <header>
    <img src="/img/logo.png">
  </header>
</template>

<script>
/*export default {
  data() {
    return {
      windowWidth: window.innerWidth,
      /!*mainSiteBase: this.$store.getters['getMainSiteBase'],
      oxyProMenuClass: {},
      oxyProMenuContainerClass: {},
      oxygen_offcanvas_menu_toggle_in_progress: false*!/
    }
  },
  computed: {
    isMobile() {
      return this.windowWidth < 991
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
  },
  methods: {
    /!*oxygen_offcanvas_menu_toggle(menu, container) {
      if (this.oxygen_offcanvas_menu_toggle_in_progress) {
        return;
      }
      container.classList.toggle('aos-animate')
      if (container.classList.contains('oxy-pro-menu-off-canvas-container')) {
        this.oxygen_offcanvas_menu_toggle_in_progress = true;
        let animation = container.getAttribute('data-oxy-pro-menu-off-canvas-animation'),
            timeout = container.getAttribute('data-aos-duration')
        if (!animation) {
          timeout = 0;
        }
        setTimeout(() => {
          container.classList.remove('oxy-pro-menu-off-canvas-container')
          menu.classList.remove('oxy-pro-menu-off-canvas')
          this.oxygen_offcanvas_menu_toggle_in_progress = false
        }, timeout)
      } else {
        container.classList.add('oxy-pro-menu-off-canvas-container')
        menu.classList.add('oxy-pro-menu-off-canvas')
      }
    },
    openMobileMenu(event) {
      const menu = this.$refs.oxyProMenu
      // off canvas
      if (event.currentTarget.classList.contains('oxy-pro-menu-off-canvas-trigger')) {
        this.oxygen_offcanvas_menu_run(menu);
      }
      // regular
      else {
        this.oxyProMenuClass['oxy-pro-menu-open'] = true
        this.oxyProMenuContainerClass['oxy-pro-menu-open-container'] = true
        document.body.classList.add('oxy-nav-menu-prevent-overflow')
        document.documentElement.classList.add('oxy-nav-menu-prevent-overflow')
      }
      // remove animation and collapse
      this.$refs.oxyProMenu.removeAttribute('data-aos')
    },
    oxygen_offcanvas_menu_run(menu) {
      const container = this.$refs.oxyProMenuContainer
      if (!container.hasAttribute('data-aos')) {
        // initialize animation
        setTimeout(() => this.oxygen_offcanvas_menu_toggle(menu, container), 0);
      } else {
        this.oxygen_offcanvas_menu_toggle(menu, container);
      }
    },
    closeMobileMenu() {
      const menu = this.$refs.oxyProMenu
      this.oxyProMenuClass['oxy-pro-menu-open'] = false
      this.oxyProMenuContainerClass['oxy-pro-menu-open-container'] = false
      document.body.classList.remove('oxy-nav-menu-prevent-overflow')
      document.documentElement.classList.remove('oxy-nav-menu-prevent-overflow')

      if (this.$refs.oxyProMenuContainer.classList.contains('oxy-pro-menu-off-canvas-container')) {
        this.oxygen_offcanvas_menu_run(menu);
      }
    }*!/
  }
}*/
export default {}
</script>

<style scoped lang="scss">
/*header > .oxy-header-row:first-child ul > li:first-child {
  display: block !important;
}

header > .oxy-header-row[data-target="mobile"] ul > li:not(:last-child):after {
  content: '';
}

#-pro-menu-15-6 .oxy-pro-menu-container.oxy-pro-menu-open-container .menu-item a, #-pro-menu-15-6 .oxy-pro-menu-container.oxy-pro-menu-off-canvas-container .menu-item a {
  padding-top: 12px;
  padding-bottom: 12px;
}*/
header {
  text-align: center;
  img {
    width: 300px;
    margin: 50px 0;
  }
}
</style>
