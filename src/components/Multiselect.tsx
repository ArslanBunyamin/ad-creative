"use client";

import { useRef, useState } from "react";
import { FaCaretLeft, FaXmark } from "react-icons/fa6";
import { Character } from "rickmortyapi";
import getRickApi from "@/app/api/getChars";
import Image from "next/image";

type Props = {};

const Multiselect = (props: Props) => {
  const [searchValue, setsearchValue] = useState("");
  const [addedCharacters, setAddedCharacters] = useState<Character[]>([]);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [searchResults, setsearchResults] = useState<Character[]>([]);

  const searchHandler = async (searchString: string) => {
    if (searchString === "" || searchString.length < 3) {
      setsearchResults([]);
      optionsRef.current?.classList.add("hidden");
      return;
    }

    setsearchValue(searchString);

    const res = await getRickApi(searchString);

    optionsRef.current?.classList.remove("hidden");

    if (res) setsearchResults(res);

    if (!res?.length) {
      optionsRef.current?.classList.add("hidden");
    }
  };

  const characterSelectHandler = (character: Character) => {
    if (addedCharacters.find((ch) => ch.id == character.id)) {
      setAddedCharacters((prev) => {
        return prev.filter((ch) => ch.id !== character.id);
      });
    } else {
      setAddedCharacters((prev) => [...prev, character]);
    }
  };

  return (
    <div className="w-1/2">
      <div className="flex border rounded-2xl border-slate-400 items-center shadow-md flex-wrap">
        <div className="flex rounded-lg p-1  flex-wrap max-h-24 overflow-y-auto">
          {addedCharacters
            ? addedCharacters.map((character) => (
                <div
                  className="flex items-center rounded-lg bg-slate-200 p-1 m-1"
                  key={character.id}
                >
                  <span className="px-2">{character.name}</span>
                  <button
                    className=" bg-slate-400 p-1 rounded hover:bg-slate-500 transition-colors"
                    type="button"
                    onClick={() => characterSelectHandler(character)}
                  >
                    <FaXmark className="text-white" />
                  </button>
                </div>
              ))
            : ""}
        </div>
        <div className="grow rounded-xl overflow-hidden flex flex-nowrap items-center p-2">
          <input
            className="p-1 w-full outline-none bg-white"
            type="text"
            id="search"
            placeholder="search a rick"
            onChange={(e) => searchHandler(e.target.value.trim())}
            autoComplete="off"
          />
          <FaCaretLeft
            className={[
              searchResults.length ? "-rotate-90" : "",
              "transition-transform text-2xl",
            ].join(" ")}
          />
        </div>
      </div>
      <div
        className="p-2 border rounded-lg border-slate-400 mt-2 shadow-lg hidden"
        ref={optionsRef}
      >
        <ul className="list-none m-0 overflow-y-scroll max-h-64 select-none">
          {searchResults.map((character) => {
            const splitted = character.name.toLowerCase().split(searchValue);
            return (
              <li
                key={character.id}
                className="cursor-pointer hover:bg-slate-100 flex items-center p-1"
              >
                <input
                  type="checkbox"
                  id={"" + character.id}
                  onChange={(e) => {
                    characterSelectHandler(character);
                  }}
                  onKeyUp={(e) => {
                    if (e.key === " ") {
                      characterSelectHandler(character);
                    }
                  }}
                  className="size-4"
                  checked={
                    addedCharacters.find((ch) => ch.id == character.id)
                      ? true
                      : false
                  }
                />
                <label
                  className="cursor-pointer p-1 flex w-full"
                  htmlFor={"" + character.id}
                >
                  <div className="img-container size-12">
                    <Image
                      src={character.image}
                      alt={character.name}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="pl-2">
                    <span>{splitted[0]}</span>
                    <b>{searchValue}</b>
                    <span>{splitted[1]}</span>
                    <div className="text-slate-500">
                      {character.episode.length + " Episodes"}
                    </div>
                  </div>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Multiselect;
