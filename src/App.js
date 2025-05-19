import React, { useState, useEffect, useCallback, useMemo } from "react";

const defaultFormData = {
  name: "About Basement Systems",
  companyName: "Basement Systems",
  legalName: "Basement Systems, Inc.",
  description:
    "About Basement Systems, Waterproofing company. Basement Systems Inc. , based in Seymour, Connecticut, is a network of basement waterproofing and crawl space repair contractors spanning across the United States and Canada...",
  url: "https://www.basementsystems.com/",
  pageId: "https://www.basementsystems.com/company.html",
  mainEntityOfPage: "https://www.basementsystems.com/",
  websiteId: "https:///#website",
  lastReviewed: "2023-08-25 18:51:11",
  audience: [],
  corporationId:
    "https://www.basementsystems.com/company.html/#/schema/corporation/4f38108bdab5a435",
  streetAddress: "60 Silvermine Road",
  addressLocality: "Seymour",
  postalCode: "06483",
  addressCountry: "US",
  socialProfiles: [
    "https://www.bbb.org/us/ct/seymour/profile/basement-waterproofing/basement-systems-inc-0111-87118487",
    "https://www.linkedin.com/company/basement-systems-inc-",
    "https://twitter.com/basementsystems",
    "https://www.facebook.com/basementsystemsinc/",
  ],
  additionalType: "https://en.wikipedia.org/wiki/Basement_waterproofing",
  images: [],
  logo: "https://cdn.treehouseinternetgroup.com/cms_images/215/bs-logo-2018.svg",
  alternateNames: ["Basement Systems", "Inc."],
  founders: [{ name: "Larry Janesky", url: "http://www.larryjanesky.com/" }],
  employees: [],
  subOrganization: [],
  contactPoints: [],
  awards: [],
  disambiguatingDescription: "Basement Systems: Waterproofing company.",
  notes: "",
};

const sectionTitles = {
  basic: "Basic Page Information",
  website: "Website Information",
  company: "Company Information",
  address: "Address Information",
  social: "Social Profiles",
  review: "Review Information",
  media: "Media Information",
  people: "People Information",
  organization: "Organization Information",
  additional: "Additional Information",
};

const standardSections = ["basic", "website", "company", "address", "social"];

const allFieldsSections = [
  ...standardSections,
  "review",
  "media",
  "people",
  "organization",
  "additional",
];

function safeValue(val) {
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  return "";
}

const fallbackCopyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch {
    document.body.removeChild(textArea);
    return false;
  }
};

const JsonLdEditor = () => {
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [mode, setMode] = useState("standard");
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [expandedSections, setExpandedSections] = useState(() =>
    Object.fromEntries(allFieldsSections.map((sec) => [sec, false]))
  );

  useEffect(() => {
    setFormData({ ...defaultFormData });
    setExpandedSections(
      Object.fromEntries(allFieldsSections.map((sec) => [sec, false]))
    );
  }, []);

  useEffect(() => {
    setExpandedSections(
      Object.fromEntries(allFieldsSections.map((sec) => [sec, false]))
    );
  }, [mode]);

  const visibleSections = useMemo(
    () => (mode === "allFields" ? allFieldsSections : standardSections),
    [mode]
  );

  const toggleSection = useCallback((key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...defaultFormData });
    setExpandedSections(
      Object.fromEntries(allFieldsSections.map((sec) => [sec, false]))
    );
  }, []);

  const handleInputChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleArrayFieldChange = useCallback(
    (field, idx) => (e) => {
      const value = e.target.value;
      setFormData((prev) => {
        const arr = Array.isArray(prev[field]) ? prev[field].slice() : [];
        arr[idx] = value;
        return { ...prev, [field]: arr };
      });
    },
    []
  );

  const handleRemoveArrayField = useCallback(
    (field, idx) => () => {
      setFormData((prev) => {
        const arr = Array.isArray(prev[field]) ? prev[field].slice() : [];
        arr.splice(idx, 1);
        return { ...prev, [field]: arr };
      });
    },
    []
  );

  const handleAddArrayField = useCallback(
    (field) => () => {
      setFormData((prev) => {
        const arr = Array.isArray(prev[field]) ? prev[field].slice() : [];
        arr.push("");
        return { ...prev, [field]: arr };
      });
    },
    []
  );

  const handlePeopleArrayChange = useCallback(
    (field, idx, key) => (e) => {
      const value = e.target.value;
      setFormData((prev) => {
        const arr = Array.isArray(prev[field]) ? prev[field].slice() : [];
        arr[idx] = { ...arr[idx], [key]: value };
        return { ...prev, [field]: arr };
      });
    },
    []
  );

  const handleAddPeople = useCallback(
    (field) => () => {
      setFormData((prev) => {
        const arr = Array.isArray(prev[field]) ? prev[field].slice() : [];
        arr.push({ name: "", url: "" });
        return { ...prev, [field]: arr };
      });
    },
    []
  );

  const handleRemovePeople = useCallback(
    (field, idx) => () => {
      setFormData((prev) => {
        const arr = Array.isArray(prev[field]) ? prev[field].slice() : [];
        arr.splice(idx, 1);
        return { ...prev, [field]: arr };
      });
    },
    []
  );

  const renderTextField = useCallback(
    (label, field, placeholder = "") => (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type="text"
          value={safeValue(formData[field])}
          placeholder={placeholder}
          onChange={handleInputChange(field)}
          className="w-full p-2 border border-gray-300 rounded"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    ),
    [formData, handleInputChange]
  );

  const renderTextArea = useCallback(
    (label, field, rows = 3) => (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <textarea
          value={safeValue(formData[field])}
          onChange={handleInputChange(field)}
          rows={rows}
          className="w-full p-2 border border-gray-300 rounded"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    ),
    [formData, handleInputChange]
  );

  const renderArrayField = useCallback(
    (label, field, itemName = "item") => (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {(formData[field] || []).map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={safeValue(item)}
              onChange={handleArrayFieldChange(field, idx)}
              className="flex-1 p-2 border border-gray-300 rounded"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className="bg-red-100 text-red-600 px-2 rounded"
              onClick={handleRemoveArrayField(field, idx)}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded hover:bg-green-200"
          onClick={handleAddArrayField(field)}
        >
          + Add {itemName}
        </button>
      </div>
    ),
    [
      formData,
      handleArrayFieldChange,
      handleRemoveArrayField,
      handleAddArrayField,
    ]
  );

  const renderPeopleArrayField = useCallback(
    (label, field, itemName = "item") => (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {(formData[field] || []).map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={safeValue(item.name)}
              placeholder="Name"
              onChange={handlePeopleArrayChange(field, idx, "name")}
              className="flex-1 p-2 border border-gray-300 rounded"
              autoComplete="off"
              spellCheck={false}
            />
            <input
              type="text"
              value={safeValue(item.url)}
              placeholder="URL"
              onChange={handlePeopleArrayChange(field, idx, "url")}
              className="flex-1 p-2 border border-gray-300 rounded"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className="bg-red-100 text-red-600 px-2 rounded"
              onClick={handleRemovePeople(field, idx)}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded hover:bg-green-200"
          onClick={handleAddPeople(field)}
        >
          + Add {itemName}
        </button>
      </div>
    ),
    [formData, handlePeopleArrayChange, handleRemovePeople, handleAddPeople]
  );

  const generatedJson = useMemo(
    () =>
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          id: formData.pageId,
          mainEntityOfPage: formData.mainEntityOfPage,
          isPartOf: { "@type": "WebSite", id: formData.websiteId },
          lastReviewed: formData.lastReviewed,
          reviewedBy: {
            "@type": "Corporation",
            name: formData.companyName,
            url: formData.url,
          },
          audience: formData.audience,
          name: formData.name,
          about: {
            "@type": "Corporation",
            id: formData.corporationId,
            description: formData.description,
            name: formData.companyName,
            url: formData.url,
            mainEntityOfPage: formData.mainEntityOfPage,
            sameAs: formData.socialProfiles,
            additionalType: formData.additionalType,
            image: formData.images,
            alternateName: formData.alternateNames,
            legalName: formData.legalName,
            logo: formData.logo,
            address: {
              "@type": "PostalAddress",
              streetAddress: formData.streetAddress,
              addressLocality: formData.addressLocality,
              postalCode: formData.postalCode,
              addressCountry: formData.addressCountry,
            },
            location: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                streetAddress: formData.streetAddress,
                addressLocality: formData.addressLocality,
                postalCode: formData.postalCode,
                addressCountry: formData.addressCountry,
              },
            },
            founder: formData.founders,
            award: formData.awards,
            employee: formData.employees,
            subOrganization: formData.subOrganization,
            contactPoint: formData.contactPoints,
            disambiguatingDescription: formData.disambiguatingDescription,
          },
        },
        null,
        2
      ),
    [formData]
  );

  const copyToClipboard = useCallback(() => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(generatedJson)
        .then(() => {
          setCopyButtonText("Copied!");
          setTimeout(() => setCopyButtonText("Copy"), 1500);
        })
        .catch(() => {
          const fallback = fallbackCopyTextToClipboard(generatedJson);
          setCopyButtonText(fallback ? "Copied!" : "Failed");
          setTimeout(() => setCopyButtonText("Copy"), 1500);
        });
    } else {
      const fallback = fallbackCopyTextToClipboard(generatedJson);
      setCopyButtonText(fallback ? "Copied!" : "Failed");
      setTimeout(() => setCopyButtonText("Copy"), 1500);
    }
  }, [generatedJson]);

  const Section = useCallback(
    ({ title, sectionKey, children }) => (
      <div className="mb-4 border border-gray-200 rounded">
        <button
          type="button"
          onClick={() => toggleSection(sectionKey)}
          className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 font-medium text-gray-800 rounded-t"
        >
          {title} {expandedSections[sectionKey] ? "▲" : "▼"}
        </button>
        {expandedSections[sectionKey] && (
          <div className="p-4 bg-white rounded-b">{children}</div>
        )}
      </div>
    ),
    [expandedSections, toggleSection]
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-green-700 text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white text-green-700 font-bold w-10 h-10 rounded-md flex items-center justify-center mr-3">
              TM
            </div>
            <h1 className="text-xl font-bold">JSON-LD Schema Generator</h1>
          </div>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded font-semibold ${
                mode === "standard"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-green-700 border border-green-600 hover:bg-green-50"
              }`}
              onClick={() => setMode("standard")}
            >
              Standard Mode
            </button>
            <button
              className={`px-3 py-1 rounded font-semibold ${
                mode === "allFields"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-green-700 border border-green-600 hover:bg-green-50"
              }`}
              onClick={() => setMode("allFields")}
            >
              All Fields Mode
            </button>
            <button
              className="px-3 py-1 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 font-semibold"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="w-1/2 p-4 overflow-auto bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Form Fields
          </h2>
          {visibleSections.map((key) => (
            <Section key={key} title={sectionTitles[key]} sectionKey={key}>
              {
                {
                  basic: (
                    <>
                      {renderTextField("Page Name", "name")}
                      {renderTextField("Page ID (URL)", "pageId")}
                      {renderTextField("Main Entity Page", "mainEntityOfPage")}
                    </>
                  ),
                  website: <>{renderTextField("Website ID", "websiteId")}</>,
                  company: (
                    <>
                      {renderTextField("Company Name", "companyName")}
                      {renderTextField("Legal Name", "legalName")}
                      {renderTextField("Company URL", "url")}
                      {renderTextField("Corporation ID", "corporationId")}
                      {renderTextArea("Company Description", "description", 5)}
                    </>
                  ),
                  address: (
                    <>
                      {renderTextField("Street Address", "streetAddress")}
                      {renderTextField("City", "addressLocality")}
                      {renderTextField("Postal Code", "postalCode")}
                      {renderTextField("Country", "addressCountry")}
                    </>
                  ),
                  social: (
                    <>
                      {renderArrayField(
                        "Social Media URLs",
                        "socialProfiles",
                        "URL"
                      )}
                    </>
                  ),
                  review: (
                    <>
                      {renderTextField(
                        "Last Reviewed DateTime",
                        "lastReviewed"
                      )}
                    </>
                  ),
                  media: (
                    <>
                      {renderTextField("Logo URL", "logo")}
                      {renderTextField("Additional Type URL", "additionalType")}
                      {renderArrayField("Images", "images", "Image")}
                      {renderArrayField(
                        "Alternate Names",
                        "alternateNames",
                        "Name"
                      )}
                    </>
                  ),
                  people: (
                    <>
                      {renderPeopleArrayField(
                        "Founders",
                        "founders",
                        "Founder"
                      )}
                      {renderPeopleArrayField(
                        "Employees",
                        "employees",
                        "Employee"
                      )}
                    </>
                  ),
                  organization: (
                    <>
                      {renderArrayField(
                        "Sub Organizations",
                        "subOrganization",
                        "Organization"
                      )}
                      {renderArrayField(
                        "Contact Points",
                        "contactPoints",
                        "Contact"
                      )}
                      {renderArrayField("Awards", "awards", "Award")}
                    </>
                  ),
                  additional: (
                    <>
                      {renderArrayField(
                        "Audience Types",
                        "audience",
                        "Audience"
                      )}
                      {renderTextArea(
                        "Disambiguating Description",
                        "disambiguatingDescription"
                      )}
                    </>
                  ),
                }[key]
              }
            </Section>
          ))}
          {mode === "allFields" && (
            <div className="my-6 py-2 border-b-2 border-green-600">
              <span className="text-green-700 font-semibold uppercase tracking-wide">
                Advanced Fields
              </span>
            </div>
          )}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (for reference only)
            </label>
            <textarea
              value={safeValue(formData.notes)}
              onChange={handleInputChange("notes")}
              rows={2}
              placeholder="Add any notes about this schema..."
              className="w-full p-2 border border-gray-300 rounded"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
        <div className="w-1/2 p-4 bg-gray-100">
          <div className="bg-gray-800 rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-white">
                Generated JSON-LD
              </h2>
              <div className="space-x-2">
                <button
                  className="px-3 py-1 bg-orange-500 text-white rounded text-sm font-semibold"
                  onClick={copyToClipboard}
                >
                  {copyButtonText}
                </button>
              </div>
            </div>
            <div
              className="bg-gray-900 p-4 overflow-auto"
              style={{ height: "calc(100vh - 100px)" }}
            >
              <pre className="text-green-100 text-xs whitespace-pre-wrap">
                {generatedJson}
              </pre>
            </div>
            <div className="bg-gray-700 p-3 text-sm text-gray-300">
              <p>
                <strong>Implementation:</strong> Add this code to the{" "}
                <code className="bg-gray-800 px-1 py-0.5 rounded">
                  &lt;head&gt;
                </code>{" "}
                section of your page wrapped in{" "}
                <code className="bg-gray-800 px-1 py-0.5 rounded">
                  &lt;script type="application/ld+json"&gt;
                </code>{" "}
                tags.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 text-center text-gray-600 text-sm shadow-md">
        <p>
          Created by Treehouse Marketing - For Every Branch of Your Marketing
        </p>
        <p className="text-xs mt-1">EST. 2005 | Seymour, CT</p>
      </div>
    </div>
  );
};

export default JsonLdEditor;
