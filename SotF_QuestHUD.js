/*:
 * @target MZ
 * @plugindesc v2.6 Simple quest HUD system with dynamic variable tracking.
 * @author dranahel
 * @url https://github.com/dranahel/SotF_QuestHUD
 *
 * @help
 * ============================================================================
 * SotF Quest HUD
 * ============================================================================
 *
 * Simple quest HUD plugin for RPG Maker MZ.
 *
 * I originally made this for my own project because I wanted an easy
 * way to display active objectives on the map without needing a full
 * quest system.
 *
 * Quests are handled using normal database items.
 * The item description becomes the HUD text.
 *
 * ============================================================================
 * HOW IT WORKS
 * ============================================================================
 *
 * Create a normal item in the database.
 *
 * Example:
 *
 * Name:
 * Shadow Children
 *
 * Description:
 * Talk to the shadow children. Talked to: \V[1]/5
 *
 * The plugin automatically reads the item description and displays it
 * in the HUD.
 *
 * \V[1] uses Variable 1 dynamically.
 *
 * Example:
 *
 * If Variable 1 = 3
 *
 * The player sees:
 *
 * Talked to: 3/5
 *
 * ============================================================================
 * BASIC SETUP
 * ============================================================================
 *
 * 1. Create a quest item in the database.
 * 2. Use the plugin command:
 *
 *    Show Quest HUD
 *
 * 3. Select the item ID.
 * 4. Update variables during gameplay.
 * 5. Hide the quest when completed.
 *
 * ============================================================================
 * PLUGIN COMMANDS
 * ============================================================================
 *
 * Show Quest HUD
 * - Displays a quest in the HUD.
 *
 * Hide Quest HUD
 * - Removes a specific quest.
 *
 * Hide All Quest HUDs
 * - Removes all active quests.
 *
 * ============================================================================
 * FEATURES
 * ============================================================================
 *
 * - Multiple active quests
 * - Dynamic variable tracking
 * - Automatic updates
 * - Save/load compatible
 * - Lightweight and optimized
 *
 * ============================================================================
 * TERMS OF USE
 * ============================================================================
 *
 * Free for commercial and non-commercial use.
 *
 * Credit appreciated but not required.
 *
 * ============================================================================
 * Version History
 * ============================================================================
 *
 * v2.6
 * - Initial public release
 *
 * @target MZ
 * @plugindesc v2.6 Optimized Quest HUD - Stable + Proper Wrapping Fix
 * @author dranahel
 *
 * @param hudX
 * @text HUD X Position
 * @type number
 * @default 8
 *
 * @param hudY
 * @text HUD Y Position
 * @type number
 * @default 8
 *
 * @param hudWidth
 * @text HUD Width
 * @type number
 * @default 340
 *
 * @param descLines
 * @text Max Description Lines
 * @type number
 * @default 3
 *
 * @param windowGap
 * @text Gap Between Quests
 * @type number
 * @default 6
 *
 * @param labelFontSize
 * @text Label Font Size
 * @type number
 * @default 10
 *
 * @param titleFontSize
 * @text Title Font Size
 * @type number
 * @default 14
 *
 * @param descFontSize
 * @text Description Font Size
 * @type number
 * @default 20
 *
 * @param labelColor
 * @text Label Color
 * @type string
 * @default #e8a020
 *
 * @param titleColor
 * @text Title Color
 * @type string
 * @default #6ab0e8
 *
 * @param descColor
 * @text Description Color
 * @type string
 * @default #ffffff
 *
 * @param opacity
 * @text Background Opacity
 * @type number
 * @default 180
 *
 * @command showHUD
 * @text Show Quest HUD
 * @arg itemId
 * @type item
 * @default 0
 *
 * @command hideHUD
 * @text Hide Quest HUD
 * @arg itemId
 * @type item
 * @default 0
 *
 * @command hideAllHUD
 * @text Hide All Quest HUDs
 */

(() => {

const PLUGIN_NAME = "SotF_QuestHUD";
const p = PluginManager.parameters(PLUGIN_NAME);

const CFG = {
    x: Number(p.hudX || 8),
    y: Number(p.hudY || 8),
    width: Number(p.hudWidth || 340),
    descLines: Number(p.descLines || 3),
    gap: Number(p.windowGap || 6),
    labelSize: Number(p.labelFontSize || 10),
    titleSize: Number(p.titleFontSize || 14),
    descSize: Number(p.descFontSize || 20),
    labelColor: p.labelColor || "#e8a020",
    titleColor: p.titleColor || "#6ab0e8",
    descColor: p.descColor || "#ffffff",
    opacity: Number(p.opacity || 180)
};

let _activeIds = [];

//=============================================================================
// SAVE DATA
//=============================================================================

const _Game_System_initialize = Game_System.prototype.initialize;

Game_System.prototype.initialize = function() {

    _Game_System_initialize.call(this);

    this._sotfHudIds = [];
};

const _Game_System_onAfterLoad =
    Game_System.prototype.onAfterLoad;

Game_System.prototype.onAfterLoad = function() {

    if (_Game_System_onAfterLoad) {
        _Game_System_onAfterLoad.call(this);
    }

    this._sotfHudIds = this._sotfHudIds || [];

    _activeIds = this._sotfHudIds.slice();
};

function saveHudData() {

    if ($gameSystem) {
        $gameSystem._sotfHudIds = _activeIds.slice();
    }
}

//=============================================================================
// PLUGIN COMMANDS
//=============================================================================

PluginManager.registerCommand(
    PLUGIN_NAME,
    "showHUD",
    args => {

        const id = Number(args.itemId || 0);

        if (id > 0 && !_activeIds.includes(id)) {

            _activeIds.push(id);

            saveHudData();

            requestHudRefresh();
        }
    }
);

PluginManager.registerCommand(
    PLUGIN_NAME,
    "hideHUD",
    args => {

        const id = Number(args.itemId || 0);

        _activeIds = _activeIds.filter(i => i !== id);

        saveHudData();

        requestHudRefresh();
    }
);

PluginManager.registerCommand(
    PLUGIN_NAME,
    "hideAllHUD",
    () => {

        _activeIds = [];

        saveHudData();

        requestHudRefresh();
    }
);

//=============================================================================
// HELPERS
//=============================================================================

function requestHudRefresh() {

    const scene = SceneManager._scene;

    if (scene && scene instanceof Scene_Map) {
        scene._sotfNeedHudRefresh = true;
    }
}

function calcWindowHeight(lines) {

    const padding = 12;

    return (
        padding * 2 +
        CFG.labelSize +
        CFG.titleSize +
        (lines * (CFG.descSize + 18)) +
        40
    );
}

//=============================================================================
// WINDOW
//=============================================================================

class Window_SotfQuestHUD extends Window_Base {

    initialize(x, y, itemId) {

        const rect = new Rectangle(
            x,
            y,
            CFG.width,
            140
        );

        super.initialize(rect);

        this.backOpacity = CFG.opacity;

        this._itemId = itemId;

        this._lastText = "";
        this._cachedWrapText = "";
        this._cachedLines = [];

        this._refreshTimer = 0;

        this.refresh();
    }

    update() {

        super.update();

        if ($gameMessage.isBusy()) {
            this.visible = false;
            return;
        }

        this.visible = true;

        this._refreshTimer++;

        // PERFORMANCE FIX
        if (this._refreshTimer < 30) {
            return;
        }

        this._refreshTimer = 0;

        const item = $dataItems[this._itemId];

        if (!item) {
            this.visible = false;
            return;
        }

        // REMOVE IF PLAYER LOST ITEM
        if (!$gameParty.hasItem(item)) {

            _activeIds =
                _activeIds.filter(i => i !== this._itemId);

            saveHudData();

            requestHudRefresh();

            return;
        }

        const text =
            item.name +
            this.convertEscapeCharacters(
                item.description || ""
            );

        if (text !== this._lastText) {

            this._lastText = text;

            this.refresh();
        }
    }

    //=========================================================================
    // WRAPPING
    //=========================================================================

    wrapText(text, maxWidth) {

        if (text === this._cachedWrapText) {
            return this._cachedLines;
        }

        const lines = [];

        const paragraphs = text.split(/\n/);

        const measure = (str) => {

            const clean = str
                .replace(/\\C\[\d+\]/gi, "")
                .replace(/\\FS\[\d+\]/gi, "")
                .replace(/\\I\[\d+\]/gi, "")
                .replace(/\\/g, "");

            this.contents.fontSize = CFG.descSize;

            return this.textWidth(clean);
        };

        for (const para of paragraphs) {

            if (!para.trim()) {
                continue;
            }

            const words = para.split(" ");

            let currentLine = "";

            for (const word of words) {

                const testLine =
                    currentLine
                    ? currentLine + " " + word
                    : word;

                if (
                    measure(testLine) > maxWidth &&
                    currentLine
                ) {

                    lines.push(currentLine);

                    currentLine = word;

                } else {

                    currentLine = testLine;
                }
            }

            if (currentLine) {
                lines.push(currentLine);
            }
        }

        const finalLines =
            lines.slice(0, CFG.descLines);

        this._cachedWrapText = text;
        this._cachedLines = finalLines;

        return finalLines;
    }

    //=========================================================================
    // REFRESH
    //=========================================================================

    refresh() {

        const item = $dataItems[this._itemId];

        if (!item) {
            return;
        }

        const innerW =
            this.contentsWidth() - 16;

        const text =
            this.convertEscapeCharacters(
                item.description || ""
            );

        const wrappedLines =
            this.wrapText(text, innerW);

        const neededHeight =
            calcWindowHeight(wrappedLines.length);

        // ONLY RECREATE IF HEIGHT CHANGED
        if (this.height !== neededHeight) {

            this.height = neededHeight;

            this.createContents();
        }

        this.contents.clear();

        let y = 0;

        // LABEL
        this.contents.fontSize = CFG.labelSize;

        this.changeTextColor(CFG.labelColor);

        this.drawText(
            "ACTIVE QUEST",
            0,
            y,
            innerW,
            "left"
        );

        y += CFG.labelSize + 8;

        // TITLE
        this.contents.fontSize = CFG.titleSize;

        this.changeTextColor(CFG.titleColor);

        this.drawText(
            item.name,
            0,
            y,
            innerW,
            "left"
        );

        y += CFG.titleSize + 12;

        // SEPARATOR
        this.contents.paintOpacity = 100;

        this.contents.fillRect(
            0,
            y,
            innerW,
            1,
            CFG.titleColor
        );

        this.contents.paintOpacity = 255;

        y += 12;

        // DESCRIPTION

        const lineHeight =
            CFG.descSize + 14;

        for (const line of wrappedLines) {

            this.resetFontSettings();

            this.contents.fontSize =
                CFG.descSize;

            this.changeTextColor(
                CFG.descColor
            );

            this.drawText(
                line,
                0,
                y,
                innerW,
                "left"
            );

            y += lineHeight;
        }

        this.resetFontSettings();
    }
}

//=============================================================================
// SCENE MAP
//=============================================================================

const _Scene_Map_createAllWindows =
    Scene_Map.prototype.createAllWindows;

Scene_Map.prototype.createAllWindows = function() {

    _Scene_Map_createAllWindows.call(this);

    this._sotfQuestWindows = [];

    this.rebuildQuestHUD();
};

Scene_Map.prototype.rebuildQuestHUD =
function() {

    // CLEAN OLD WINDOWS
    if (this._sotfQuestWindows) {

        for (const w of this._sotfQuestWindows) {

            if (w) {

                w.visible = false;

                if (w.parent) {
                    w.parent.removeChild(w);
                }

                w.destroy();
            }
        }
    }

    this._sotfQuestWindows = [];

    let currentY = CFG.y;

    for (const id of _activeIds) {

        const item = $dataItems[id];

        if (!item) {
            continue;
        }

        const win =
            new Window_SotfQuestHUD(
                CFG.x,
                currentY,
                id
            );

        this.addWindow(win);

        this._sotfQuestWindows.push(win);

        currentY +=
            win.height + CFG.gap;
    }
};

//=============================================================================
// DELAYED REFRESH
//=============================================================================

const _Scene_Map_update =
    Scene_Map.prototype.update;

Scene_Map.prototype.update = function() {

    _Scene_Map_update.call(this);

    if (this._sotfNeedHudRefresh) {

        this._sotfNeedHudRefresh = false;

        this.rebuildQuestHUD();
    }
};

//=============================================================================
// VARIABLE CHANGE DETECTION
//=============================================================================

const _Game_Variables_setValue =
    Game_Variables.prototype.setValue;

Game_Variables.prototype.setValue =
function(variableId, value) {

    _Game_Variables_setValue.call(
        this,
        variableId,
        value
    );

    const scene = SceneManager._scene;

    if (!scene || !scene._sotfQuestWindows) {
        return;
    }

    for (const win of scene._sotfQuestWindows) {

        if (win) {
            win._lastText = "";
        }
    }
};

})();