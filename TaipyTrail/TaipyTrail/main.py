import taipy.gui.builder as tgb
from taipy.gui import Gui

show_dialog = False

def dialog_action(state, _, payload):
    if payload["args"][0] == 0:
        print("Good to hear!")
    elif payload["args"][0] == 1:
        print("Sorry to hear that.")
    else:
        print("Ok bye.")
    state.show_dialog = False

with tgb.Page() as page:
    with tgb.dialog("{show_dialog}", title="Welcome!", on_action=dialog_action, labels="Couldn't be better;Not my day"):
        tgb.html("h2", "Hello!")

    tgb.button("Show", on_action=lambda s: s.assign("show_dialog", True))

if __name__ == "__main__":
        Gui(page).run(title="Dialog - Labels")
