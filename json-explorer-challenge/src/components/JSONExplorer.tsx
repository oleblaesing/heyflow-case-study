import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import Input from "./Input";

type JSONPrimitive = string | number | boolean | null;
type JSON = JSONPrimitive | JSON[] | { [key: string]: JSON };

function isObject(json: JSON): json is { [key: string]: JSON } {
  return json !== null && json.constructor.name === "Object";
}

function isArray(json: JSON): json is JSON[] {
  return Array.isArray(json);
}

function isPrimitive(json: JSON): json is JSONPrimitive {
  return !isObject(json) && !isArray(json);
}

const pathPrefix = "res.";

function purifyPath(path: string) {
  if (path.startsWith(pathPrefix)) {
    return path.slice(pathPrefix.length);
  }

  return path;
}

function getValueFromPath(json: JSON, path: string): JSON | undefined {
  const keys = path
    .replaceAll("][", ".")
    .replaceAll("[", ".")
    .replaceAll("]", "")
    .split(".");

  return keys.reduce((object, key) => {
    if (isArray(object)) {
      return object[parseInt(key)];
    }

    if (isObject(object)) {
      return object[key];
    }

    return object;
  }, json);
}

function Value({ value }: { value?: JSON }) {
  let output = "";

  if (value === undefined) {
    return output;
  }

  if (isPrimitive(value)) {
    output = `${value}`;
  } else {
    output = "undefined";
  }

  return <code>{output}</code>;
}

function Whitespaces({
  level,
  closingIndentation = false,
}: {
  level: number;
  closingIndentation?: boolean;
}) {
  let appliedLevel = level;

  if (closingIndentation) {
    appliedLevel = level > 0 ? level - 1 : 0;
  }

  return [...Array(appliedLevel * 4).keys()].map(() => " ").join("");
}

function ResponseKey({
  objectKey: key, // `key` is reserved in props. :(
  value,
  onClick,
}: {
  objectKey: string;
  value: JSON;
  onClick: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLAnchorElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        onClick();
      }
    },
    [onClick]
  );

  if (isArray(value) || isObject(value)) {
    return key;
  }

  return (
    <a role="button" tabIndex={0} onClick={onClick} onKeyDown={handleKeyDown}>
      {key}
    </a>
  );
}

function ResponseValue({ value }: { value: JSONPrimitive }) {
  if (typeof value === "string") {
    return `'${value}'`;
  }

  return `${value}`;
}

function Response({
  json,
  level = 0,
  path = "",
  setPath,
}: {
  json: JSON;
  level?: number;
  path?: string;
  setPath: Dispatch<SetStateAction<string>>;
}) {
  if (isPrimitive(json)) {
    return <ResponseValue value={json} />;
  }

  if (isArray(json)) {
    return (
      <>
        {"["}
        <div>
          {json.map((element, i) => (
            <div key={i}>
              <Whitespaces level={level} />
              <Response
                json={element}
                level={level + 1}
                path={`${path}[${i}]`}
                setPath={setPath}
              />
              {","}
            </div>
          ))}
        </div>
        <Whitespaces level={level} closingIndentation />
        {"]"}
      </>
    );
  }

  const isFirstLevel = level === 0;

  return (
    <>
      {isFirstLevel ? "" : "{"}
      {Object.entries(json).map(([key, value]) => (
        <div key={key}>
          <Whitespaces level={level} />
          <ResponseKey
            objectKey={key}
            value={value}
            onClick={() => {
              setPath(path === "" ? key : `${path}.${key}`);
            }}
          />
          {": "}
          <Response
            json={value}
            level={level + 1}
            path={path === "" ? key : `${path}.${key}`}
            setPath={setPath}
          />
          {","}
        </div>
      ))}
      <Whitespaces level={level} closingIndentation />
      {isFirstLevel ? "" : "}"}
    </>
  );
}

export default function JSONExplorer({ json }: { json: JSON }) {
  const [path, setPath] = useState("");

  const value = useMemo(() => {
    try {
      return getValueFromPath(json, purifyPath(path));
    } catch (e) {
      return undefined;
    }
  }, [json, path]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
        <Input
          type="text"
          label="Property"
          id="property"
          placeholder="Property"
          value={path}
          onChange={(e) => setPath(e.currentTarget.value)}
        />
        {"->"}
        <Input
          type="text"
          label="Block / Variable"
          id="block"
          placeholder="Block / Variable"
        />
        {"-"}
      </div>
      <Value value={value} />
      <div className="mt-2 ml-1">+ Assign to variable</div>
      <div className="mt-1 ml-1">+ Assign to block</div>
      <div className="mt-2">
        Response
        <pre className="border border-radius p-1">
          <code>
            <Response
              json={json}
              setPath={(nextPath) => setPath(`${pathPrefix}${nextPath}`)}
            />
          </code>
        </pre>
      </div>
    </div>
  );
}
