// Import other Functions
const jacksonFunctions = require('./jacksonFunctions');
exports.schedule = jacksonFunctions.schedule;


const _ = require("lodash");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const { dictionaryConcepMap } = require("./Dictionarys/dictionaryConceptMap");
const { dictionaryAppleMap } = require("./Dictionarys/dictionaryAppleCodesMap");
const {
  dictionaryLonicCodesMap,
} = require("./Dictionarys/dictionaryLonicCodesMap");
const { user } = require("firebase-functions/lib/providers/auth");


/** String Prototype to transform CammelCase in text with spaces  */
String.prototype.formatUnicorn =
  String.prototype.formatUnicorn ||
  function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
      var t = typeof arguments[0];
      var key;
      var args =
        "string" === t || "number" === t
          ? Array.prototype.slice.call(arguments)
          : arguments[0];

      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }

    return str;
  };

/** Enum with valid types of rules  */
var typeRule = {
  copy: "copy",
  add: "add",
  addIfHaskey: "addIfHaskey",
  fromDict: "fromDict",
  concat: "concat",
  tableMapping: "tableMapping",
  multipleValue: "multipleValue",
  addToArray: "addToArray",
};

/**  Class that defines the different methods or rules to transform a dictionary into some other required format 
 * Examples
 *   Copy exact value from key to another key
 *   --  transformRule.copyValue('input.key','output.key'),
 *  Add exact value in new format
 *   --  transformRule.addValue('input.key','Value'),
 *  add value by default if input dictionary has a key 
 *   -- transformRule.addValueIfHasKey('input.key','Output.key','Value'),
 * add a value depending on the value of a key in the input dictionary
 *  (Needs a dictionary as parameter to  mapping input -> output
 *  { 'inputA':'outputA', 'inputB':'outputB'}
 * )
 *  -- transformRule.addValueDependOnInput('input.key','output.key',{'granola':'TieneGranola'}),
 *  Concat values in a output key
 * -- transformRule.concatenation(['input.key1','input.key2'],'output.key','{0}/{1}')
*/
class transformRule {
  type = typeRule.copy;
  keyDependOn = null;

  static copyValue(keyInput, keyOutput) {
    let newRule = new transformRule();
    newRule.keyInput = keyInput;
    newRule.keyOutput = keyOutput;
    newRule.type = typeRule.copy;
    return newRule;
  }

  static addValue(KeyOutput, value) {
    let newRule = new transformRule();
    newRule.keyOutput = KeyOutput;
    newRule.valueOutput = value;
    newRule.type = typeRule.add;
    return newRule;
  }

  static addValueIfHasKey(keyInput, keyOutput, value) {
    let newRule = new transformRule();
    newRule.keyOutput = keyOutput;
    newRule.valueOutput = value;
    newRule.keyInput = keyInput;
    newRule.type = typeRule.addIfHaskey;
    return newRule;
  }

  static addMultipleValueIfHasKey(keyInput, dictOutput) {
    let newRule = new transformRule();
    newRule.keyInput = keyInput;
    newRule.outputValues = dictOutput;
    newRule.type = typeRule.multipleValue;
    return newRule;
  }

  static addValueDependOnInput(
    keyInput,
    keyOutput,
    dictValuesToTransform,
    defaultValue = null
  ) {
    let newRule = new transformRule();
    newRule.keyInput = keyInput;
    newRule.keyOutput = keyOutput;
    newRule.dictValues = dictValuesToTransform;
    newRule.defaultValue = defaultValue;
    newRule.type = typeRule.fromDict;
    return newRule;
  }

  static concatenation(keysInput, keyOutput, formatOutput) {
    let newRule = new transformRule();
    newRule.keysInput = keysInput;
    newRule.keyOutput = keyOutput;
    newRule.concatenate = true;
    newRule.formatOutput = formatOutput;
    newRule.type = typeRule.concat;
    return newRule;
  }

  static ohmFhirMappingTable(keyInput, keyOutput, tableName) {
    let newRule = new transformRule();
    newRule.keyInput = keyInput;
    newRule.keyOutput = keyOutput;
    newRule.tableName = tableName;
    newRule.type = typeRule.tableMapping;
    return newRule;
  }

  static addValueToArray(keyInput, arrayOutput, valueOutput) {
    let newRule = new transformRule();
    newRule.keyInput = keyInput;
    newRule.arrayOutput = arrayOutput;
    newRule.valueOutput = valueOutput;
    newRule.type = typeRule.addToArray;
    return newRule;
  }

  transformValue(dictInput, dictOutput) {
    if (this.keyDependOn) {
      if (!_.hasIn(dictInput, this.keyDependOn)) {
        return false;
      }
    }
    switch (this.type) {
      case typeRule.copy:
        if (_.hasIn(dictInput, this.keyInput)) {
          let value = _.get(dictInput, this.keyInput);
          _.set(dictOutput, this.keyOutput, value);
        }
        break;

      case typeRule.add:
        _.set(dictOutput, this.keyOutput, this.valueOutput);
        break;

      case typeRule.addIfHaskey:
        if (_.hasIn(dictInput, this.keyInput)) {
          _.set(dictOutput, this.keyOutput, this.valueOutput);
        }
        break;

      case typeRule.fromDict:
        if (_.hasIn(dictInput, this.keyInput)) {
          let value = _.get(dictInput, this.keyInput);
          if (this.dictValues[value]) {
            _.set(dictOutput, this.keyOutput, this.dictValues[value]);
          }
        }
        break;

      case typeRule.concat:
        let values = [];
        let hasAll = true;
        this.keysInput.forEach((element) => {
          if (_.hasIn(dictInput, element)) {
            values.push(_.get(dictInput, element));
          } else {
            hasAll = false;
          }
        });
        if (hasAll) {
          _.set(
            dictOutput,
            this.keyOutput,
            this.formatOutput.formatUnicorn(...values)
          );
        }
        break;
      case typeRule.multipleValue:
        if (_.hasIn(dictInput, this.keyInput)) {
          Object.keys(this.outputValues).forEach((key) => {
            _.set(dictOutput, key, this.outputValues[key]);
          });
        }
        break;
      case typeRule.tableMapping:
        if (_.hasIn(dictInput, this.keyInput)) {
          let idInput = _.get(dictInput, this.keyInput);
          switch (this.tableName) {
            case "concept":
              if (_.hasIn(dictionaryConcepMap, idInput)) {
                _.set(dictOutput, this.keyOutput, dictionaryConcepMap[idInput]);
              }
              break;
            case "appleCodes":
              if (_.hasIn(dictionaryAppleMap, idInput)) {
                _.set(dictOutput, this.keyOutput, dictionaryAppleMap[idInput]);
              }
              break;
            case "lonic":
              if (_.hasIn(dictionaryLonicCodesMap, idInput)) {
                _.set(
                  dictOutput,
                  this.keyOutput,
                  dictionaryLonicCodesMap[idInput]
                );
              }
              break;
          }
        }
        break;
      case typeRule.addToArray:
        if (_.hasIn(dictInput, this.keyInput)) {
          if ((_, hasIn(dictOutput, this.arrayOutput))) {
            let originalArray = _.get(dictOutput, this.arrayOutput);
            _.set(
              dictOutput,
              this.arrayOutput,
              _.concat(originalArray, [this.valueOutput])
            );
          } else {
            _.set(dictOutput, this.arrayOutput, [this.valueOutput]);
          }
        }
        break;
    }
  }
}
transformRule.prototype.AddDependendKey = function () {
  "use strict";
  var rule = this;
  rule.keyDependOn = Array.prototype.slice.call(arguments)[0];
  return rule;
};
let items = [


  transformRule.addValue("resourceType", "Observation"),
  //TODO add healthId
  transformRule.copyValue("healthId", "id"),

  //Meta
  transformRule.addValue(
    "meta.profile[0]",
    "http://www.fhir.org/mfhir/StructureDefinition/omh_fhir_profile_quantitative_observation"
  ),
  transformRule.addValue("meta.source", "cardinalkitApp"),
  transformRule.copyValue(
    "header.acqusitionProvenance.sourceName",
    "meta.source"
  ),

  //Extension
  transformRule.addValueIfHasKey(
    "body.specimen_source",
    "extension[0].url",
    "http://hl7.org/fhir/StructureDefinition/observation-specimenCode"
  ),
  transformRule.ohmFhirMappingTable(
    "body.specimen_source",
    "extension[0].valueCodeableConcept.coding[0]",
    "concept"
  ),

  //Identifier
  transformRule.copyValue("header.id", "identifier[0].value"),
  transformRule.addValue("identifier[0].system", "https://omh.org/shimmer/ids"),

  transformRule.concatenation(
    ["header.acquisition_provenance.source_data_point_id"],
    "identifier[1].value",
    "urn:uuid:{0}"
  ),
  transformRule.addValueIfHasKey(
    "header.acquisition_provenance.source_data_point_id",
    "identifier[1].system",
    "urn:ietf:rfc:3986"
  ),

  //Status
  transformRule.addValue("status", "final"),

  transformRule.addValueDependOnInput(
    "header.schema_id.name",
    "category[0].coding[0].system",
    {
      acceleration: "http://hl7.org/fhir/observation-category",
      "ambient-temperature": "http://hl7.org/fhir/observation-category",
      "blood-glucose": "http://hl7.org/fhir/observation-category",
      "blood-presure": "http://hl7.org/fhir/observation-category",
      "body-fat-percentage": "http://hl7.org/fhir/observation-category",
      "body-height": "http://hl7.org/fhir/observation-category",
      "body-mass-index": "http://hl7.org/fhir/observation-category",
      "body-temperature":
        "http://hl7.org/fhir/observation-categoryhttp://hl7.org/fhir/observation-category",
      "body-weight": "http://hl7.org/fhir/observation-category",
      "breath-carbon-monoxide": "http://hl7.org/fhir/observation-category",
      "calories-burned": "http://hl7.org/fhir/observation-categoryy",
      "diastolic-blood-pressure": "http://hl7.org/fhir/observation-category",
      "expiratory-time": "http://hl7.org/fhir/observation-category",
      geoposition: "http://hl7.org/fhir/observation-category",
      "heart-rate": "http://hl7.org/fhir/observation-category",
      "inspiratory-time": "http://hl7.org/fhir/observation-category",
      "magnetic-force": "http://hl7.org/fhir/observation-category",
      "medication-adherence-percent":
        "http://hl7.org/fhir/observation-category",
      "minute-volume": "http://hl7.org/fhir/observation-category",
      "minute-moderate-activity": "http://hl7.org/fhir/observation-category",
      orientation: "http://hl7.org/fhir/observation-category",
      "oxygen-saturation": "http://hl7.org/fhir/observation-category",
      pace: "http://hl7.org/fhir/observation-category",
      "physical-activity": "http://hl7.org/fhir/observation-category",
      "respiratory-rate": "http://hl7.org/fhir/observation-category",
      "rr-interval": "http://hl7.org/fhir/observation-category",
      "sleep-duration": "http://hl7.org/fhir/observation-category",
      "sleep-episode": "http://hl7.org/fhir/observation-category",
      speed: "http://hl7.org/fhir/observation-category",
      "step-count": "http://hl7.org/fhir/observation-category",
      "systolic-blood-pressure": "http://hl7.org/fhir/observation-category",
      "ventilation-cycle-time": "http://hl7.org/fhir/observation-category",
    }
  ),
  transformRule.addValueDependOnInput(
    "header.schema_id.name",
    "category[0].coding[0].code",
    {
      acceleration: "physical-activity",
      "ambient-temperature": "None",
      "blood-glucose": "laboratory",
      "blood-presure": "vitalsigns",
      "body-fat-percentage": "exam",
      "body-height": "vital-signs",
      "body-mass-index": "vital-signs",
      "body-temperature": "vital-signs",
      "body-weight": "vital-signs",
      "breath-carbon-monoxide": "laboratory",
      "calories-burned": "physical-activity",
      "diastolic-blood-pressure": "vital-signs",
      "expiratory-time": "exam",
      geoposition: "physical-activity",
      "heart-rate": "vital-signs",
      "inspiratory-time": "exam",
      "magnetic-force": "physical-activity",
      "medication-adherence-percent": "Survey",
      "minute-volume": "exam",
      "minute-moderate-activity": "physical-activity",
      orientation: "vital-signs",
      "oxygen-saturation": "vital-signs",
      pace: "physical-activity",
      "physical-activity": "physical-activity",
      "respiratory-rate": "vital-signs",
      "rr-interval": "exam",
      "sleep-duration": "physical-activity",
      "sleep-episode": "physical-activity",
      speed: "physical-activity",
      "step-count": "physical-activity",
      "systolic-blood-pressure": "vital-signs",
      "ventilation-cycle-time": "exam",
    }
  ),
  transformRule.addValueDependOnInput(
    "header.schema_id.name",
    "category[0].coding[0].display",
    {
      acceleration: "Activity",
      "blood-glucose": "Laboratory",
      "blood-presure": "Vital Signs",
      "body-fat-percentage": "Exam",
      "body-height": "Vital Signs",
      "body-mass-index": "Vital Signs",
      "body-temperature": "Vital Signs",
      "body-weight": "Vital Signs",
      "breath-carbon-monoxide": "Laboratory",
      "calories-burned": "Activity",
      "diastolic-blood-pressure": "Vital Signs",
      "expiratory-time": "Exam",
      geoposition: "Activity",
      "heart-rate": "Vital Signs",
      "inspiratory-time": "Exam",
      "magnetic-force": "Activity",
      "medication-adherence-percent": "Survey",
      "minute-volume": "Exam",
      "minute-moderate-activity": "Activity",
      orientation: "Vital Signs",
      "oxygen-saturation": "Vital Signs",
      pace: "Activity",
      "physical-activity": "Activity",
      "respiratory-rate": "vVital Signs",
      "rr-interval": "Exam",
      "sleep-duration": "Activity",
      "sleep-episode": "Activity",
      speed: "Activity",
      "step-count": "Activity",
      "systolic-blood-pressure": "Vital Signs",
      "ventilation-cycle-time": "Exam",
    }
  ),

  //Code

  transformRule.ohmFhirMappingTable(
    "header.schema_id.name",
    "code.coding[0]",
    "lonic"
  ),

  transformRule.concatenation(
    ["body.descriptive_statistic", "header.schema_id.name"],
    "code.coding[1].code",
    "{0}-{1}"
  ),
  transformRule.concatenation(
    ["header.schema_id.name", "body.descriptive_statistic"],
    "code.coding[1].display"
  ),
  transformRule.addValueIfHasKey(
    "body.descriptive_statistic",
    "code.coding[1].system",
    "http://www.fhir.org/guides/mfhir/omh_fhir_observation_codes"
  ),

  //Code base in categoryType

  transformRule.copyValue("body.quantity_type", "code.coding[1].code"),
  transformRule.copyValue("body.quantity_type", "code.coding[1].display"),

  transformRule.copyValue("body.category_type", "code.coding[1].code"),
  transformRule.copyValue("body.category_type", "code.coding[1].display"),

  transformRule.copyValue("body.activity_name", "code.coding[1].code"),
  transformRule.copyValue("body.activity_name", "code.coding[1].display"),

  transformRule.copyValue("body.category_value", "valueString"),

  //Replace based on AppleCodes Table
  transformRule.ohmFhirMappingTable(
    "header.schema_id.name",
    "code.coding[1]",
    "appleCodes"
  ),
  transformRule.ohmFhirMappingTable(
    "body.quantity_type",
    "code.coding[1]",
    "appleCodes"
  ),
  transformRule.ohmFhirMappingTable(
    "body.category_type",
    "code.coding[1]",
    "appleCodes"
  ),

  transformRule.addValue("code.coding[1].system", "com.apple.health"),

  //Subject //add userId
  transformRule.copyValue("header.user_id", "subject.identifier.value"),
  transformRule.addValue(
    "subject.identifier.system",
    "https://omh.org/shimmer/patient_ids"
  ),

  //Effective datetime period
  transformRule.copyValue(
    "body.effective_time_frame.date_time",
    "effectiveDateTime"
  ),
  transformRule.copyValue(
    "body.effective_time_frame.time_interval.start_date_time",
    "effectivePeriod.start"
  ),
  transformRule.copyValue(
    "body.effective_time_frame.time_interval.end_date_time",
    "effectivePeriod.end"
  ),

  //issued
  transformRule.copyValue("header.creation_date_time", "issued"),

  //Value Quantity
  transformRule.addValueDependOnInput(
    "header.schema_id.name",
    "valueQuantity.unit",
    {
      "blood-glucose": "‘[mg/dL’, ‘mmol/L’]",
      "body-fat-percentage": "%",
      "body-height": "[‘cm’, ‘in’]",
      "body-mass-index": "kg/m^2",
      "body-temperature": "[‘K’,’F’,’C’]",
      "body-weight": "[‘kg’, ‘g’, ‘lb’]",
      "calories-burned": "kcal",
      "diastolic-blood-pressure": "mmHg",
      "heart-rate": "beats/min",
      "minute-moderate-activity": "min",
      "oxygen-saturation": "%",
      "respiratory-rate": "breaths/min",
      "rr-interval": "R-R interval by EKG",
      "sleep-duration": "[‘sec’, ‘min’, ‘h’]",
      "step-count": "steps",
      "systolic-blood-pressure": "mmHg",
    }
  ),
  transformRule.addValueDependOnInput(
    "header.schema_id.name",
    "valueQuantity.system",
    {
      "blood-glucose": "http://unitsofmeasure.org",
      "body-fat-percentage": "http://unitsofmeasure.org",
      "body-height": "http://unitsofmeasure.org",
      "body-mass-index": "http://unitsofmeasure.org",
      "body-temperature": "http://unitsofmeasure.org",
      "body-weight": "http://unitsofmeasure.org",
      "calories-burned": "http://unitsofmeasure.org",
      "diastolic-blood-pressure": "http://unitsofmeasure.org",
      "heart-rate": "http://unitsofmeasure.org",
      "minute-moderate-activity": "http://unitsofmeasure.org",
      "oxygen-saturation": "http://unitsofmeasure.org",
      "respiratory-rate": "http://unitsofmeasure.org",
      "rr-interval": "http://unitsofmeasure.org",
      "sleep-duration": "http://unitsofmeasure.org",
      "step-count": "http://unitsofmeasure.org",
      "systolic-blood-pressure": "http://unitsofmeasure.org",

      "hk-quantity-sample": "http://unitsofmeasure.org",
    }
  ),

  //pace
  transformRule.copyValue("body.pace.value", "valueQuantity.value"),
  transformRule.copyValue("body.pace.unit", "valueQuantity.unit"),

  //Heart Rate
  transformRule.copyValue("body.heart_rate.value", "valueQuantity.value"),
  transformRule.addValueIfHasKey(
    "body.heart_rate",
    "valueQuantity.code",
    "/min"
  ),

  //Blood Gluccose
  transformRule.ohmFhirMappingTable(
    "body.blood_glucose.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue("body.blood_glucose.value", "valueQuantity.value"),
  transformRule.copyValue("body.blood_glucose.unit", "valueQuantity.unit"),

  //ambient_temperature
  transformRule.ohmFhirMappingTable(
    "body.ambient_temperature.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue(
    "body.ambient_temperature.value",
    "valueQuantity.value"
  ),
  transformRule.copyValue(
    "body.ambient_temperature.unit",
    "valueQuantity.unit"
  ),

  //KCAL_BURNED
  transformRule.ohmFhirMappingTable(
    "body.kcal_burned.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue("body.kcal_burned.value", "valueQuantity.value"),
  transformRule.copyValue("body.kcal_burned.unit", "valueQuantity.unit"),

  //Respiratoty Rate
  transformRule.copyValue("body.respiratory_rate.value", "valueQuantity.value"),
  transformRule.copyValue("body.respiratory_rate.unit", "valueQuantity.unit"),
  transformRule.addValueIfHasKey(
    "body.respiratory_rate",
    "valueQuantity.code",
    "/min"
  ),

  //Body Temperature
  transformRule.ohmFhirMappingTable(
    "body.body_temperature.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue("body.body_temperature.value", "valueQuantity.value"),
  transformRule.copyValue("body.body_temperature.unit", "valueQuantity.unit"),

  //Body weight

  transformRule.ohmFhirMappingTable(
    "body.body_weight.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue("body.body_weight.value", "valueQuantity.value"),
  transformRule.copyValue("body.body_weight.unit", "valueQuantity.unit"),

  //Body height

  transformRule.ohmFhirMappingTable(
    "body.body_height.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue("body.body_height.value", "valueQuantity.value"),
  transformRule.copyValue("body.body_height.unit", "valueQuantity.unit"),

  //body fat percentage

  transformRule.ohmFhirMappingTable(
    "body.body_fat_percentage.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue(
    "body.body_fat_percentage.value",
    "valueQuantity.value"
  ),
  transformRule.copyValue(
    "body.body_fat_percentage.unit",
    "valueQuantity.unit"
  ),

  //body mass index
  transformRule.ohmFhirMappingTable(
    "body.body_mass_index.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue("body.body_mass_index.value", "valueQuantity.value"),
  transformRule.copyValue("body.body_mass_index.unit", "valueQuantity.unit"),

  //breath_carbon_monoxide
  transformRule.ohmFhirMappingTable(
    "body.breath_carbon_monoxide.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue(
    "body.breath_carbon_monoxide.value",
    "valueQuantity.value"
  ),
  transformRule.copyValue(
    "body.breath_carbon_monoxide.unit",
    "valueQuantity.unit"
  ),

  //expiratory_time
  transformRule.ohmFhirMappingTable(
    "body.expiratory_time.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue("body.expiratory_time.value", "valueQuantity.value"),
  transformRule.copyValue("body.expiratory_time.unit", "valueQuantity.unit"),

  //Blood Pressure ---
  //No data
  // Oxygen Saturation
  transformRule.copyValue(
    "body.oxygen_saturation.value",
    "valueQuantity.value"
  ),
  transformRule.addValueIfHasKey(
    "body.oxygen_saturation",
    "valueQuantity.unit",
    "%"
  ),
  transformRule.addValueIfHasKey(
    "body.oxygen_saturation",
    "valueQuantity.code",
    "%"
  ),

  //Step Count
  transformRule.copyValue("body.step_count", "valueQuantity.value"),
  transformRule.copyValue("body.step_count.value", "valueQuantity.value"),
  transformRule.addValueIfHasKey(
    "body.step_count",
    "valueQuantity.unit",
    "steps"
  ),
  transformRule.addValueIfHasKey(
    "body.step_count",
    "valueQuantity.code",
    "{steps}"
  ),
  transformRule
    .addValueDependOnInput(
      "body.descriptive_statistic_denominatoris",
      "valueQuantity.unit",
      {
        d: "steps/day",
        w: "steps/week",
        m: "steps/month",
        episode: "steps/episode",
        session: "steps/session",
      }
    )
    .AddDependendKey("body.step_count"),
  transformRule
    .addValueDependOnInput(
      "body.descriptive_statistic_denominatoris",
      "valueQuantity.code",
      {
        d: "{steps}/d",
        w: "{steps}/wk",
        m: "{steps}/mo",
        episode: "{steps}/{episode}",
        session: "{steps}/{session}",
      }
    )
    .AddDependendKey("body.step_count"),

  //Sleep Time Data

  transformRule.copyValue("body.total_sleep_time.value", "valueQuantity.value"),
  transformRule.addValueIfHasKey(
    "body.total_sleep_time",
    "valueQuantity.unit",
    "steps"
  ),
  transformRule.addValueIfHasKey(
    "body.total_sleep_time",
    "valueQuantity.code",
    "{steps}"
  ),
  transformRule
    .addValueDependOnInput(
      "body.descriptive_statistic_denominatoris",
      "valueQuantity.unit",
      {
        d: "/day",
        w: "/week",
        m: "/month",
        episode: "/episode",
        session: "/session",
      }
    )
    .AddDependendKey("body.total_sleep_time"),
  transformRule
    .addValueDependOnInput(
      "body.descriptive_statistic_denominatoris",
      "valueQuantity.code",
      {
        d: "/d",
        w: "/wk",
        m: "/mo",
        episode: "/{episode}",
        session: "/{session}",
      }
    )
    .AddDependendKey("body.total_sleep_time"),

  //Sleep duration

  transformRule.ohmFhirMappingTable(
    "body.sleep_duration.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue("body.sleep_duration.value", "valueQuantity.value"),
  transformRule.copyValue("body.sleep_duration.unit", "valueQuantity.unit"),

  //speed

  transformRule.ohmFhirMappingTable(
    "body.speed.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue("body.speed.value", "valueQuantity.value"),
  transformRule.copyValue("body.speed.unit", "valueQuantity.unit"),

  //ventilation_cycle_time

  transformRule.ohmFhirMappingTable(
    "body.ventilation_cycle_time.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue(
    "body.ventilation_cycle_time.value",
    "valueQuantity.value"
  ),
  transformRule.copyValue(
    "body.ventilation_cycle_time.unit",
    "valueQuantity.unit"
  ),

  //hk quantity sample
  transformRule.ohmFhirMappingTable(
    "body.unit_value.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue("body.unit_value.value", "valueQuantity.value"),
  transformRule.copyValue("body.unit_value.unit", "valueQuantity.unit"),
  transformRule.copyValue("body.count", "valueQuantity.value"),

  //hk Workout
  transformRule.ohmFhirMappingTable(
    "body.distance.unit",
    "valueQuantity",
    "concept"
  ),
  transformRule.copyValue("body.distance.value", "valueQuantity.value"),
  transformRule.copyValue("body.distance.unit", "valueQuantity.unit"),

  //device
  transformRule.copyValue(
    "header.acquisition_provenance.source_name",
    "device.display"
  ),
  transformRule.copyValue(
    "header.acquisition_provenance.modality",
    "device.extension[0].valueCode"
  ),
  transformRule.addValueIfHasKey(
    "header.acquisition_provenance.modality",
    "device.extension[0].url",
    "http://www.fhir.org/mfhir/StructureDefinition/extenion-modality"
  ),

  //Component

  //Geoposition
  transformRule.copyValue(
    "body.latitude.value",
    "component[0].valueQuantity.value"
  ),
  transformRule.copyValue(
    "body.latitude.unit",
    "component[0].valueQuantity.unit"
  ),

  transformRule.copyValue(
    "body.longitude.value",
    "component[0].valueQuantity.value"
  ),
  transformRule.copyValue(
    "body.longitude.unit",
    "component[0].valueQuantity.unit"
  ),
  transformRule.copyValue(
    "body.positioning_system",
    "component[0].valueQuantity.positioning_system"
  ),

  //temporal_relationship_to_sleep
  transformRule.addMultipleValueIfHasKey(
    "body.temporal_relationship_to_sleep",
    {
      "component[0].code.coding[0].code": "relative-to-sleep",
      "component[0].code.coding[0].system":
        "http://www.fhir.org/guides/mfhir/omh_fhir_observation_codes",
      "component[0].code.coding[0].display":
        "OMH to FHIR Temporal Relationship To Sleep",
    }
  ),
  transformRule.ohmFhirMappingTable(
    "body.temporal_relationship_to_sleep",
    "component[0].valueCodeableConcept.coding[0]",
    "concept"
  ),
  transformRule.copyValue(
    "body.temporal_relationship_to_sleep",
    "component[0].valueCodeableConcept.text"
  ),

  //temporal_relationship_to_physical_activity
  transformRule.addMultipleValueIfHasKey(
    "body.temporal_relationship_to_physical_activity",
    {
      "component[0].code.coding[1].code": "relative-to-activity",
      "component[0].code.coding[1].system":
        "http://www.fhir.org/guides/mfhir/omh_fhir_observation_codes",
      "component[0].code.coding[1].display":
        "OMH to FHIR Temporal Relationship To Physical Activity",
    }
  ),
  transformRule.ohmFhirMappingTable(
    "body.temporal_relationship_to_physical_activity",
    "component[0].valueCodeableConcept.coding[0]",
    "concept"
  ),
  transformRule.copyValue(
    "body.temporal_relationship_to_physical_activity",
    "component[0].valueCodeableConcept.text"
  ),

  //temporal_relationship_to_meal
  transformRule.addMultipleValueIfHasKey("body.temporal_relationship_to_meal", {
    "component[0].code.coding[2].code": "relative-to-meal",
    "component[0].code.coding[2].system":
      "http://www.fhir.org/guides/mfhir/omh_fhir_observation_codes",
    "component[0].code.coding[2].display":
      "OMH to FHIR Temporal Relationship To Meal",
  }),
  transformRule.ohmFhirMappingTable(
    "body.temporal_relationship_to_meal",
    "component[0].valueCodeableConcept.coding[0]",
    "concept"
  ),
  transformRule.copyValue(
    "body.temporal_relationship_to_meal",
    "component[0].valueCodeableConcept.text"
  ),

  //oxygen_therapy_mode_of_administration
  transformRule.addMultipleValueIfHasKey(
    "body.oxygen_therapy_mode_of_administration",
    {
      "component[0].code.coding[3].code": "o2-administration-method",
      "component[0].code.coding[3].system":
        "http://www.fhir.org/guides/mfhir/omh_fhir_observation_codes",
      "component[0].code.coding[3].display":
        "Oxygen Therapy Mode of Administration",
    }
  ),
  transformRule.copyValue(
    "body.oxygen_therapy_mode_of_administration",
    "component[0].valueString"
  ),

  transformRule.copyValue(
    "body.reported_activity_intensity",
    "component[0].valueString"
  ),

  //supplemental_oxygen_flow_rate
  transformRule.addMultipleValueIfHasKey("body.supplemental_oxygen_flow_rate", {
    "component[0].code.coding[4].code": "3151-8",
    "component[0].code.coding[4].system": "http://loinc.org",
    "component[0].code.coding[4].display": "Inhaled oxygen flow rate",
  }),
  transformRule.copyValue(
    "body.supplemental_oxygen_flow_rate.value",
    "component[0].valueQuantity.value"
  ),
  transformRule.copyValue(
    "body.supplemental_oxygen_flow_rate.unit",
    "component[0].valueQuantity.unit"
  ),
  transformRule.addValueIfHasKey(
    "body.supplemental_oxygen_flow_rate",
    "component[0].valueQuantity.system",
    "http://unitsofmeasure.org"
  ),
  transformRule.addValueIfHasKey(
    "body.supplemental_oxygen_flow_rate",
    "component[0].valueQuantity.code",
    "l/min"
  ),

  //body posture

  transformRule.addMultipleValueIfHasKey("body.body_posture", {
    "component[0].code.coding[5].code": "271605009",
    "component[0].code.coding[5].system": "http://snomed.info/sct",
    "component[0].code.coding[5].display":
      "Position of body and posture (observable entity)",
  }),
  transformRule.ohmFhirMappingTable(
    "body.body_posture",
    "component[0].valueCodeableConcept.coding[0]",
    "concept"
  ),
  transformRule.copyValue(
    "body.body_posture",
    "component[0].valueCodeableConcept.text"
  ),

  //diastolic blood pressure
  transformRule.addMultipleValueIfHasKey("body.diastolic_blood_pressure", {
    "component[0].code.coding[6].code": "8462-4",
    "component[0].code.coding[6].system": "http://loinc.org",
    "component[0].code.coding[6].display": "Diastolic blood pressure",
  }),
  transformRule.copyValue(
    "body.diastolic_blood_pressure.value",
    "component[0].valueQuantity.value"
  ),
  transformRule.copyValue(
    "body.diastolic_blood_pressure.unit",
    "component[0].valueQuantity.unit"
  ),
  transformRule.addValueIfHasKey(
    "body.diastolic_blood_pressure",
    "component[0].valueQuantity.system",
    "http://unitsofmeasure.org"
  ),
  transformRule.addValueIfHasKey(
    "body.diastolic_blood_pressure",
    "component[0].valueQuantity.system",
    "mm[Hg]"
  ),

  //sistolic  blood pressure
  transformRule.addMultipleValueIfHasKey("body.systolic_blood_pressure", {
    "component[0].code.coding[7].code": "8480-6",
    "component[0].code.coding[7].system": "http://loinc.org",
    "component[0].code.coding[7].display": "Systolic blood pressure",
  }),
  transformRule.copyValue(
    "body.systolic_blood_pressure.value",
    "component[0].valueQuantity.value"
  ),
  transformRule.copyValue(
    "body.systolic_blood_pressure.unit",
    "component[0].valueQuantity.unit"
  ),
  transformRule.addValueIfHasKey(
    "body.systolic_blood_pressure",
    "component[0].valueQuantity.system",
    "http://unitsofmeasure.org"
  ),
  transformRule.addValueIfHasKey(
    "body.systolic_blood_pressure",
    "component[0].valueQuantity.system",
    "mm[Hg]"
  ),

  //activity Name
  transformRule.addMultipleValueIfHasKey("body.activity_name", {
    "component[0].code.coding[8].code": "257733005",
    "component[0].code.coding[8].system": "http://snomed.info/sct",
    "component[0].code.coding[8].display": "Activity",
  }),
  transformRule.copyValue(
    "body.activity_name",
    "component[0].valueCodeableConcept.text"
  ),

  //Create value in server for resource_id
  transformRule.copyValue("header.documentId", "id"),
];


/** Send FhirFormat to firebase */
async function sendToFirestore(studyId, userId, recordId, data) {
  await db.doc(
    `studies/${studyId}` + `/users/${userId}` + `/healthFhir/${recordId}`
  ).set({ ...data });
}


/** Firebase function to transform string date into firebase timestamp */
exports.updateHour = functions.firestore
.document("/studies/{studyId}/users/{userId}/healthKit/{healthId}")
.onUpdate(async(change,context)=>{
  const newValue = change.after.data()
  if(!newValue["header"]["creation_date_time_p"]){
    let stringDate = newValue["header"]["creation_date_time"];
    let dateJs = new Date(stringDate);
    let dateFirebase = admin.firestore.Timestamp.fromDate(dateJs);
    await db.doc(
      `studies/${context.params.studyId}` +
        `/users/${context.params.userId}` +
        `/healthKit/${context.params.healthId}`
    ).set(
      {
        header: {
          creation_date_time_p: stringDate,
          creation_date_time: dateFirebase,
        },
      },
      { merge: true }
    );

  }
})

/** Firebase function to transform ohm Format to FHIR format */
exports.omhToFhir = functions.firestore
  .document("/studies/{studyId}/users/{userId}/healthKit/{healthId}")
  .onCreate( async(snapshot, context) => {
    let dataOmh = { ...snapshot.data() };
    if (!("header" in dataOmh)) {
      dataOmh["header"] = {};
    }
    dataOmh["header"]["user_id"] = context.params.userId;
    dataOmh["header"]["documentId"] = context.params.healthId;
    let dicFhir = {};
    items.forEach((element) => {
      element.transformValue(dataOmh, dicFhir);
    });
    let array = _.get(dicFhir, "identifier", []);
    if (array.length > 0) {
      _.remove(array, function (n) {
        return n == undefined;
      });
      _.set(dicFhir, "identifier", array);
    }
    array = _.get(dicFhir, "code.coding", []);
    if (array.length > 0) {
      _.remove(array, function (n) {
        return n == undefined;
      });
      _.set(dicFhir, "code.coding", array);
    }
    array = _.get(dicFhir, "component[0].code.coding", []);
    if (array.length > 0) {
      _.remove(array, function (n) {
        return n == undefined;
      });
      _.set(dicFhir, "component[0].code.coding", array);
    }
    await sendToFirestore(
      context.params.studyId,
      context.params.userId,
      context.params.healthId,
      dicFhir
    );

    let stringDate = dataOmh["header"]["creation_date_time"];
    let dateJs = new Date(stringDate);
    let dateFirebase = admin.firestore.Timestamp.fromDate(dateJs);

    await db.doc(
      `studies/${context.params.studyId}` +
        `/users/${context.params.userId}` +
        `/healthKit/${context.params.healthId}`
    ).set(
      {
        header: {
          creation_date_time_p: stringDate,
          creation_date_time: dateFirebase,
        },
      },
      { merge: true }
    );
  });


/** Firebase function to create user roles  on firebase*/
exports.createUserRol = functions.firestore
  .document("/studies/{studyId}/users/{userId}")
  .onCreate(async (snapshot, context) => {
    await db.doc(`users_roles/${context.params.userId}`)
      .get()
      .then((userInfo) => {
        if (!userInfo.exists) {
          db.doc(`users_roles/${context.params.userId}`).set({
            rol: "user",
            studies: [`${context.params.studyId}`],
          });
        }
      });
  });

  /** Firebase function to add user email in firestore records*/
exports.addUserEmail = functions.firestore
  .document("/studies/{studyId}/users/{userId}")
  .onCreate((snapshot, context) => {
    admin
      .auth()
      .getUser(context.params.userId)
      .then((userRecord) => {
        db.doc(
          `/studies/${context.params.studyId}/users/${context.params.userId}`
        ).set(
          {
            name: `${userRecord.email}`,
          },
          { merge: true }
        );
      });
  });
