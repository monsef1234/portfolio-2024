<template>
  <div
    class="title-bar flex items-center justify-between p-2 bg-[var(--color-2)] h-10"
  >
    <span class="title font-bold tracking-widest">{{ app.name }}</span>
    <div class="controls flex items-center gap-2">
      <button>
        <SvgIcon
          :path="mdiWindowMinimize"
          type="mdi"
          :size="24"
          @click.stop="$emit('minimize-app', app)"
        />
      </button>
      <button>
        <SvgIcon
          :path="mdiWindowClose"
          type="mdi"
          :size="24"
          @click.stop="$emit('close-app', app)"
        />
      </button>
    </div>
  </div>
  <div
    class="content font-lucida py-4 px-2 tracking-tighter lowercase h-[calc(100%-2.5rem)] overflow-auto"
    ref="content"
  >
    <div v-for="(line, index) in outputLines" :key="index" class="mt-1">
      <p class="prompt grid grid-cols-[auto_1fr] gap-1">
        <span class="w-52 inline-block">C:&#92;Monsef's Portfolio&#92;></span>
        <span class="inline-block wrap font-bold">{{ line.prompt }}</span>
      </p>
      <p v-if="!line.isHtml" class="output my-2 break-words">
        {{ line.message }}
      </p>
      <div v-else class="my-2 break-words" v-html="line.message"></div>
    </div>

    <div class="grid grid-cols-[auto_1fr] gap-1 mt-1">
      <p class="w-52">C:&#92;Monsef's Portfolio&#92;></p>
      <input
        class="bg-transparent border-none outline-none w-full placeholder:text-[var(--color-5)] placeholder:opacity-50"
        ref="commandInput"
        type="text"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        :placeholder="checkPlaceholder ? `Enter a command` : ``"
        v-model="command"
        @blur="!checkDevices && handleFocus()"
        @keydown.enter="commandHandler"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiWindowClose, mdiWindowMinimize } from "@mdi/js";
import { App } from "@/types/app";
import { outputLine } from "@/types/output-line";

export default defineComponent({
  name: "Terminal",

  props: {
    app: {
      type: Object as PropType<App>,
      required: true,
    },
  },

  emits: ["close-app", "minimize-app"],

  setup() {
    const commandInput = ref<HTMLInputElement>();
    const content = ref<HTMLDivElement>();

    return {
      mdiWindowClose,
      mdiWindowMinimize,
      commandInput,
      content,
    };
  },

  components: { SvgIcon },

  data() {
    return {
      command: "" as string,
      historyIndex: -1 as number,
      download: false as boolean,

      outputLines: [
        {
          prompt: "welcome",
          message: this.welcomeMessage(),
          isHtml: true,
        },
      ] as outputLine[],
      history: [] as string[],
      commands: [
        "help",
        "about",
        "projects",
        "resume",
        "history",
        "clear",
        "welcome",
      ] as string[],
    };
  },

  methods: {
    commandHandler() {
      if (!this.command.trim()) return;
      if (this.checkDevices && this.$refs.commandInput)
        (this.$refs.commandInput as HTMLInputElement)?.blur();

      this.history.push(this.command.toLowerCase());
      this.historyIndex = -1;

      switch (this.command.toLowerCase()) {
        case "help":
          this.outputLines.push({
            prompt: this.command,
            message: this.helpMessage(),
            isHtml: true,
          });
          break;
        case "clear":
          this.outputLines = [];
          break;
        case "welcome":
          this.outputLines.push({
            prompt: this.command,
            message: this.welcomeMessage(),
            isHtml: true,
          });
          break;
        case "history":
          this.outputLines.push({
            prompt: this.command,
            message: this.history.join("<br>"),
            isHtml: true,
          });
          break;
        case "resume":
          this.outputLines.push({
            prompt: this.command,
            message: "Download started ...",
            isHtml: true,
          });
          this.download = true;
          break;
        case "about":
          this.outputLines.push({
            prompt: this.command,
            message:
              "Hey there! i'm <em class='font-bold'>Bouras Moncef Sofiane</em> <br/> I'm a Web Developer from Algeria <br/> more about me download my resume by typing command <span class='font-bold'>'resume'</span>",
            isHtml: true,
          });
          break;
        case "projects":
          this.outputLines.push({
            prompt: this.command,
            message: this.projectsMessage(),
            isHtml: true,
          });
          break;
        default:
          this.outputLines.push({
            prompt: this.command,
            message:
              "Unknown command: type '<strong>help</strong>' for a list of commands",
            isHtml: true,
          });
      }

      this.command = "";
    },

    welcomeMessage() {
      return `<div class="flex gap-2">
          <pre id="tiresult" style="font-size: 9px; background-color: #000000; font-weight: bold; padding: 4px 5px; --fs: 9px;"><b style="color:#DAD9DA">0</b><b style="color:#DADADA">0</b><b style="color:#DBDADB">1</b><b style="color:#DBDBDC">00</b><b style="color:#DDDDDE">1</b><b style="color:#E3E3E4">0</b><b style="color:#E5E5E6">1</b><b style="color:#D9D8D9">1</b><b style="color:#C1BFBF">0</b><b style="color:#C0BFBF">1</b><b style="color:#D9D8D8">0</b><b style="color:#E5E4E5">11</b><b style="color:#DDDDDE">0</b><b style="color:#DCDCDD">1</b><b style="color:#DCDBDD">1</b><b style="color:#DBDBDC">0</b><b style="color:#DBDADC">0</b><b style="color:#DADADB">1</b>
  <b style="color:#DBDADB">1</b><b style="color:#DCDBDC">1</b><b style="color:#DCDCDC">0</b><b style="color:#DDDCDD">1</b><b style="color:#DFDEDF">1</b><b style="color:#DFDEDE">0</b><b style="color:#B5B3B3">1</b><b style="color:#797675">0</b><b style="color:#4E4847">0</b><b style="color:#2D2928">1</b><b style="color:#2D2929">1</b><b style="color:#444141">1</b><b style="color:#646161">1</b><b style="color:#A9A8A9">0</b><b style="color:#DFDFDF">0</b><b style="color:#DFDFE0">1</b><b style="color:#DDDDDE">1</b><b style="color:#DCDCDD">00</b><b style="color:#DCDBDD">0</b>
  <b style="color:#DCDBDC">1</b><b style="color:#DDDCDC">1</b><b style="color:#DDDDDD">0</b><b style="color:#DFDEDF">1</b><b style="color:#E2E1E1">1</b><b style="color:#848080">1</b><b style="color:#272322">1</b><b style="color:#3B2B24">1</b><b style="color:#8D6452">1</b><b style="color:#A97C67">1</b><b style="color:#AD806B">0</b><b style="color:#A37866">1</b><b style="color:#7D5747">1</b><b style="color:#312724">1</b><b style="color:#6D6A6B">1</b><b style="color:#E1DFE0">1</b><b style="color:#E1E0E1">1</b><b style="color:#DFDEDF">0</b><b style="color:#DEDDDE">0</b><b style="color:#DCDCDD">0</b>
  <b style="color:#DDDCDC">1</b><b style="color:#DDDDDD">1</b><b style="color:#DFDEDE">1</b><b style="color:#DFDFDF">0</b><b style="color:#E4E3E4">0</b><b style="color:#BAB9BA">1</b><b style="color:#5D4C44">1</b><b style="color:#AA795D">1</b><b style="color:#AB7B62">0</b><b style="color:#C99073">1</b><b style="color:#F8B294">1</b><b style="color:#C28B72">0</b><b style="color:#B9856C">0</b><b style="color:#946C59">1</b><b style="color:#666160">1</b><b style="color:#E3E1E3">10</b><b style="color:#E1DFE0">1</b><b style="color:#DFDEDF">1</b><b style="color:#DDDCDD">1</b>
  <b style="color:#DEDDDE">1</b><b style="color:#DFDEDE">0</b><b style="color:#E0DFDF">0</b><b style="color:#E0DFE0">0</b><b style="color:#E4E3E5">0</b><b style="color:#E0D3D0">1</b><b style="color:#B3836C">0</b><b style="color:#D99C7D">0</b><b style="color:#D3987C">0</b><b style="color:#CB8D6F">0</b><b style="color:#E4A485">1</b><b style="color:#CE8F74">1</b><b style="color:#DB9C80">1</b><b style="color:#D1967B">1</b><b style="color:#BD9D92">1</b><b style="color:#E6E5E7">1</b><b style="color:#E3E1E3">1</b><b style="color:#E1DFE1">0</b><b style="color:#E0DEDF">0</b><b style="color:#DEDDDE">0</b>
  <b style="color:#DFDEDF">1</b><b style="color:#E0DEE0">0</b><b style="color:#E0DFE0">10</b><b style="color:#E3E1E3">0</b><b style="color:#E3DDDB">0</b><b style="color:#CEAB9A">1</b><b style="color:#CB9275">1</b><b style="color:#DE9F7E">0</b><b style="color:#C98A6F">0</b><b style="color:#CA8770">1</b><b style="color:#D08F75">0</b><b style="color:#E3A283">1</b><b style="color:#D4A18B">1</b><b style="color:#E1CDC5">0</b><b style="color:#E4E3E6">1</b><b style="color:#E1DFE1">1</b><b style="color:#E0DFE0">0</b><b style="color:#DFDEDF">1</b><b style="color:#DDDCDD">1</b>
  <b style="color:#DEDDDE">0</b><b style="color:#E0DEE0">1</b><b style="color:#E1E0E1">0</b><b style="color:#E3E1E2">1</b><b style="color:#E5E3E4">0</b><b style="color:#EAE9EA">0</b><b style="color:#E9E8EA">1</b><b style="color:#BA967D">0</b><b style="color:#AA7957">1</b><b style="color:#B37E62">0</b><b style="color:#B97D66">0</b><b style="color:#B17F65">0</b><b style="color:#B98769">0</b><b style="color:#DBCBC3">1</b><b style="color:#ECEDEF">1</b><b style="color:#E7E5E6">0</b><b style="color:#E4E2E3">1</b><b style="color:#E1DFE0">1</b><b style="color:#DEDDDE">1</b><b style="color:#DCDADB">0</b>
  <b style="color:#E0DFDF">1</b><b style="color:#E1E0E1">0</b><b style="color:#DDDCDD">1</b><b style="color:#D3D2D3">1</b><b style="color:#C2C0C0">0</b><b style="color:#A4A3A4">0</b><b style="color:#989594">0</b><b style="color:#BC957B">0</b><b style="color:#BA8969">1</b><b style="color:#A67A5B">0</b><b style="color:#AB7D60">0</b><b style="color:#B8896E">1</b><b style="color:#D19C7D">1</b><b style="color:#A99387">1</b><b style="color:#9A9A9C">1</b><b style="color:#B7B5B6">1</b><b style="color:#C9C7C8">0</b><b style="color:#D5D3D4">1</b><b style="color:#DCDADC">1</b><b style="color:#E0DEDF">0</b>
  <b style="color:#9E9D9D">0</b><b style="color:#848484">0</b><b style="color:#787777">0</b><b style="color:#6D6C6C">0</b><b style="color:#626261">0</b><b style="color:#5F5F5E">1</b><b style="color:#706864">0</b><b style="color:#CCA082">0</b><b style="color:#D6A383">1</b><b style="color:#D09E7F">0</b><b style="color:#CE9B7E">0</b><b style="color:#DBA789">0</b><b style="color:#C99B80">1</b><b style="color:#72645D">1</b><b style="color:#5F5F5F">0</b><b style="color:#696767">0</b><b style="color:#6A6969">1</b><b style="color:#6D6C6C">0</b><b style="color:#7B7A7A">1</b><b style="color:#919091">1</b>
  <b style="color:#646463">0</b><b style="color:#686767">1</b><b style="color:#706F6E">1</b><b style="color:#727170">1</b><b style="color:#7A7979">1</b><b style="color:#7D7C7B">1</b><b style="color:#706F6E">0</b><b style="color:#897D77">0</b><b style="color:#BC9E8C">1</b><b style="color:#D1AB94">1</b><b style="color:#C8A590">1</b><b style="color:#A78E7F">1</b><b style="color:#746C69">0</b><b style="color:#6D6C6C">0</b><b style="color:#777574">0</b><b style="color:#7B7A79">0</b><b style="color:#787676">0</b><b style="color:#6E6D6C">1</b><b style="color:#656463">1</b><b style="color:#616060">1</b>
  </pre>
        <div class="flex flex-col gap-2 self-end">
          <p>Welocome to Monsef's Portfolio</p>
          ----
          <p>To view a list of commands type <strong>'help'</strong></p>
        </div>
        </div>`;
    },

    helpMessage() {
      return `<div>
        <div class="flex gap-2">
          <em class="font-bold w-24">welcome</em>
          <p>- View the welcome message</p>
        </div>
        <div class="flex gap-2">
          <em class="font-bold w-24">about</em>
          <p>- Learn more about me</p>
        </div>
        <div class="flex gap-2">
          <em class="font-bold w-24">projects</em>
          <p>- View my projects</p>
        </div>
        <div class="flex gap-2">
          <em class="font-bold w-24">resume</em>
          <p>- Download my resume</p>
        </div>
        <div class="flex gap-2">
          <em class="font-bold w-24">history</em>
          <p>- View the command history</p>
        </div>
        <div class="flex gap-2">
          <em class="font-bold w-24">clear</em>
          <p>- Clear the terminal</p>
        </div>
        </div>`;
    },

    projectsMessage() {
      return `<div class="flex flex-col gap-2">
        <div>
          - <a class="text-[var(--color-5)] underline hover:text-[var(--color-6)] uppercase" href="https://github.com/monsef1234/map-talk-chat" target="_blank">Map Talk Chat</a>
          <p>A real-time location-based chat application that allows users to communicate with others on an interactive map interface. Users can see each other's locations, start chats, engage in conversations, and make video calls based on their geographical proximity.</p>
        </div>
        <div>
          - <a class="text-[var(--color-5)] underline hover:text-[var(--color-6)] uppercase" href="https://github.com/monsef1234/ai-assistant" target="_blank">AI Assistant</a>
          <p>A Vue.js-based chat interface that integrates with Azure OpenAI for text and speech interactions, providing an interactive AI assistant experience.</p>
        </div>
        </div>`;
    },

    handleFocus() {
      if (this.commandInput) {
        this.$nextTick(() => {
          this.commandInput?.focus();
        });
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        if (this.content) this.content.scrollTop = this.content.scrollHeight;
      });
    },

    downloadResume() {
      const filePath = "/src/assets/files/resume.pdf";

      const link = document.createElement("a");
      link.href = filePath;
      link.download = "Bouras Moncef Sofiane - Web Developer - CV.pdf";
      link.click();
      link.remove();
    },

    handleNavigateUsingArrowKeys(e: KeyboardEvent) {
      const isArrowUp = e.key === "ArrowUp";
      const isArrowDown = e.key === "ArrowDown";

      if (!isArrowUp && !isArrowDown) return;

      let history: string[] = [...new Set(this.history)];

      if (isArrowDown) {
        if (this.historyIndex >= history.length - 1) {
          this.historyIndex = -1;
          this.command = "";
        } else {
          this.historyIndex++;
          this.command = history[this.historyIndex];
        }
      }

      if (isArrowUp) {
        if (this.historyIndex < 0) {
          this.historyIndex = history.length - 1;
          history.length > 0
            ? (this.command = history[this.historyIndex])
            : (this.command = "");
        } else {
          this.historyIndex--;
          this.historyIndex < 0
            ? (this.command = "")
            : (this.command = history[this.historyIndex]);
        }
      }

      //works with Arrow down but not with Arrow up
      // this.commandInput?.setSelectionRange(
      //   this.command.length,
      //   this.command.length
      // );
    },

    navigateUsingArrowKeys() {
      document.addEventListener("keydown", this.handleNavigateUsingArrowKeys);
    },

    handleTabComplete(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      if (!this.command.trim()) return;

      const writingMatch = this.commands.filter((command) =>
        command.toLowerCase().startsWith(this.command.toLowerCase())
      );

      if (writingMatch.length === 0) return;

      if (writingMatch.length === 1) {
        this.command = writingMatch[0];
      }

      if (writingMatch.length > 1) {
        this.outputLines.push({
          prompt: this.command,
          message: writingMatch.join("<br>"),
          isHtml: true,
        });
      }
    },

    completeWithTab() {
      document.addEventListener("keydown", this.handleTabComplete);
    },
  },

  watch: {
    app() {
      this.handleFocus();
    },

    outputLines: {
      handler() {
        this.scrollToBottom();
      },
      deep: true,
    },

    download(value) {
      if (value) {
        setTimeout(() => {
          this.downloadResume();
          this.download = false;
        }, 1000);
      }
    },
  },

  computed: {
    checkDevices() {
      return window.matchMedia("(max-width: 768px)").matches;
    },

    checkPlaceholder() {
      if (!this.checkDevices || this.outputLines.length > 1) return false;

      return true;
    },
  },

  mounted() {
    !this.checkDevices && this.handleFocus();
    this.navigateUsingArrowKeys();
    this.completeWithTab();
  },

  beforeUnmount() {
    document.removeEventListener("keydown", this.handleNavigateUsingArrowKeys);
    document.removeEventListener("keydown", this.handleTabComplete);
  },
});
</script>
<style scoped>
.prompt span:last-of-type {
  overflow-wrap: anywhere;
}
</style>
