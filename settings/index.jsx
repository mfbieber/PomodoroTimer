function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Demo Settings</Text>}>
        <Toggle
          settingsKey="toggle"
          label="Toggle Switch"
        />
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: "tomato"},
            {color: "sandybrown"},
            {color: "#FFD700"},
            {color: "#ADFF2F"},
            {color: "deepskyblue"},
            {color: "plum"}
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
