import { bind, Gio } from "astal";
import { Astal, Gdk, Gtk } from "astal/gtk3";
import AstalTray from "gi://AstalTray";

const tray = AstalTray.get_default();

export default () => {
  return (
    <box className="SysTray">
      {bind(tray, "items").as((items) =>
        items
          .filter((item) => item.gicon)
          .map((item) => (
            <menubutton
              tooltipMarkup={bind(item, "tooltipMarkup")}
              usePopover={false}
              actionGroup={bind(item, "actionGroup").as((ag) => [
                "dbusmenu",
                ag,
              ])}
              menuModel={bind(item, "menuModel")}
              onButtonReleaseEvent={(self, event) => {
                const [_, x, y] = event.get_root_coords();
                const button = event.get_button()[1];
                const { PRIMARY, SECONDARY } = Astal.MouseButton;
                const { SOUTH, NORTH } = Gdk.Gravity;
                if (button === PRIMARY) {
                  item.activate(x, y);
                } else if (button === SECONDARY) {
                  self.get_popup()?.popup_at_widget(self, SOUTH, NORTH, event);
                }
                // This is will prevent the event from further propagation.
                // If true is not returned, the primary click will trigger both activate and the popup menu.
                return true;
              }}
            >
              <icon gicon={bind(item, "gicon")} />
            </menubutton>
          )),
      )}
    </box>
  );
};
