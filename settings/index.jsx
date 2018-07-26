function mySettings(props) {
    return (
    <Page>
      <Section
        title={<Text bold align="center">Pomodoro Timer Settings</Text>}>
        <Slider
          settingsKey="sliderWorking"
          label={`Work for ${props.settingsStorage.getItem('sliderWorking')} Minutes`}
          min="0"
          max="90"
          onChange={value => props.settingsStorage.setItem('sliderWorking', value)}
        />
          <Slider
              settingsKey="sliderResting"
              label={`Rest for ${props.settingsStorage.getItem('sliderResting')} Minutes`}
              min="0"
              max="90"
              onChange={value => props.settingsStorage.setItem('sliderResting', value)}
          />
          <Text>Select background color:</Text>
        <ColorSelect
          settingsKey="backgroundColor"
          colors={[
              {color: "#000000"},
              {color: "#42113b"},
              {color: "#574f4f"},
              {color: "#e6ddcd"},
              {color: "#cadff3"},
              {color: "#eafbc8"},
              {color: "#ffffff"}
          ]}
          label="Background color"
        />
          <Text>Select working arc color:</Text>
          <ColorSelect
          label="Working arc color"
          settingsKey="workArcColor"
          colors={[
              {color: "#cce4da"},
              {color: "#ae2c51"},
              {color: "#5b787f"},
              {color: "#143647"},
              {color: "#d85978"},
              {color: "#f1cb45"},
              {color: "#2a6363"}
          ]}
        />
          <Text>Select resting arc color:</Text>
          <ColorSelect
          label="Resting arc color"
          settingsKey="restArcColor"
          colors={[
              {color: "#cb858a"},
              {color: "#dc8331"},
              {color: "#abdeb1"},
              {color: "#c9b386"},
              {color: "#cce4da"},
              {color: "#8d9933"},
              {color: "#459eae"}
              ]}
        />
          <Text>Select text color:</Text>
          <ColorSelect
              label="Text color"
              settingsKey="textColor"
              colors={[
                  {color: "#000000"},
                  {color: "#143647"},
                  {color: "#574f4f"},
                  {color: "#5b787f"},
                  {color: "#87c5b4"},
                  {color: "#d5ceca"},
                  {color: "#ffffff"}
              ]}
          />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);